import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import uuid

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

# Define constants
NUM_CASES = 5000
START_DATE = datetime(2024, 1, 1)
END_DATE = datetime(2025, 3, 1)

# Define activities in the order-to-cash process
ACTIVITIES = [
    "Receive Purchase Order",
    "Create Sales Order",
    "Change Net Price in Sales Order",
    "Change Material in Sales Order",
    "Change Manual Price in Sales Order",
    "Create Delivery",
    "Create Shipment",
    "Issue Goods",
    "Create Invoice",
    "Clear Invoice",
    "Reject Sales Order",
    "Cancel Sales Order Rejection",
    "Deactivate Delivery Block",
    "Deactivate Billing Block"
]

# Define possible process variants (happy path and deviations)
PROCESS_VARIANTS = {
    "standard_path": [
        "Receive Purchase Order",
        "Create Sales Order",
        "Create Delivery",
        "Create Shipment",
        "Issue Goods",
        "Create Invoice",
        "Clear Invoice"
    ],
    "price_change_path": [
        "Receive Purchase Order",
        "Create Sales Order",
        "Change Net Price in Sales Order",
        "Create Delivery",
        "Create Shipment",
        "Issue Goods",
        "Create Invoice",
        "Clear Invoice"
    ],
    "material_change_path": [
        "Receive Purchase Order",
        "Create Sales Order",
        "Change Material in Sales Order",
        "Create Delivery",
        "Create Shipment",
        "Issue Goods",
        "Create Invoice",
        "Clear Invoice"
    ],
    "manual_price_change_path": [
        "Receive Purchase Order",
        "Create Sales Order",
        "Change Manual Price in Sales Order",
        "Create Delivery",
        "Create Shipment",
        "Issue Goods",
        "Create Invoice",
        "Clear Invoice"
    ],
    "invoice_before_shipment": [
        "Receive Purchase Order",
        "Create Sales Order",
        "Create Invoice",
        "Create Delivery",
        "Create Shipment",
        "Issue Goods",
        "Clear Invoice"
    ],
    "invoice_after_invoice": [
        "Receive Purchase Order",
        "Create Sales Order",
        "Create Delivery",
        "Create Shipment",
        "Issue Goods",
        "Create Invoice",
        "Create Invoice",
        "Clear Invoice"
    ],
    "rejected_order": [
        "Receive Purchase Order",
        "Create Sales Order",
        "Reject Sales Order"
    ],
    "rejected_then_continued": [
        "Receive Purchase Order",
        "Create Sales Order",
        "Reject Sales Order",
        "Cancel Sales Order Rejection",
        "Create Delivery",
        "Create Shipment",
        "Issue Goods",
        "Create Invoice",
        "Clear Invoice"
    ],
    "delivery_block": [
        "Receive Purchase Order",
        "Create Sales Order",
        "Deactivate Delivery Block",
        "Create Delivery",
        "Create Shipment",
        "Issue Goods",
        "Create Invoice",
        "Clear Invoice"
    ],
    "billing_block": [
        "Receive Purchase Order",
        "Create Sales Order",
        "Create Delivery",
        "Create Shipment",
        "Issue Goods",
        "Deactivate Billing Block",
        "Create Invoice",
        "Clear Invoice"
    ]
}

# Define variant probabilities
VARIANT_PROBABILITIES = {
    "standard_path": 0.4,
    "price_change_path": 0.15,
    "material_change_path": 0.05,
    "manual_price_change_path": 0.05,
    "invoice_before_shipment": 0.07,
    "invoice_after_invoice": 0.08,
    "rejected_order": 0.05,
    "rejected_then_continued": 0.05,
    "delivery_block": 0.05,
    "billing_block": 0.05
}

# Define companies and their regions
COMPANIES = {
    "Drystone Belgium NV": "Europe",
    "Drystone Australia Ltd": "Asia-Pacific",
    "Drystone Mexico Inc": "Americas",
    "Drystone Austria AG": "Europe",
    "Drystone Malaysia Co": "Asia-Pacific",
    "Drystone France SA": "Europe",
    "Drystone China LLC": "Asia-Pacific",
    "Drystone Deutschland GmbH": "Europe",
    "Drystone India Ltd": "Asia-Pacific",
    "Drystone Italia S.P.A": "Europe",
    "Drystone Spain Co": "Europe",
    "Drystone US Inc": "Americas",
    "Drystone Ireland Ltd": "Europe",
    "Drystone UK Ltd": "Europe"
}

# Define material groups
MATERIAL_GROUPS = [
    "Power Tools",
    "Safety equipment",
    "Building Materials",
    "Fasteners",
    "Agriculture",
    "Fertilizers",
    "Power Drills"
]

# Define payment terms
PAYMENT_TERMS = [
    "30 days from date of invoice",
    "45 days from date of invoice",
    "60 days from date of invoice",
    "90 days from date of invoice"
]

# Define activity durations (in days) - mean and standard deviation
ACTIVITY_DURATIONS = {
    "Receive Purchase Order": (0.5, 0.2),
    "Create Sales Order": (1.0, 0.5),
    "Change Net Price in Sales Order": (0.5, 0.2),
    "Change Material in Sales Order": (0.7, 0.3),
    "Change Manual Price in Sales Order": (0.5, 0.2),
    "Create Delivery": (2.0, 1.0),
    "Create Shipment": (1.5, 0.7),
    "Issue Goods": (1.0, 0.5),
    "Create Invoice": (1.0, 0.5),
    "Clear Invoice": (5.0, 2.0),
    "Reject Sales Order": (0.5, 0.2),
    "Cancel Sales Order Rejection": (1.0, 0.5),
    "Deactivate Delivery Block": (1.0, 0.5),
    "Deactivate Billing Block": (1.0, 0.5)
}

# Define company-specific lead time factors (multiplier for activity durations)
COMPANY_LEAD_TIME_FACTORS = {
    "Drystone Belgium NV": 1.5,
    "Drystone Australia Ltd": 1.4,
    "Drystone Mexico Inc": 1.3,
    "Drystone Austria AG": 1.2,
    "Drystone Malaysia Co": 1.1,
    "Drystone France SA": 1.1,
    "Drystone China LLC": 1.1,
    "Drystone Deutschland GmbH": 1.0,
    "Drystone India Ltd": 0.9,
    "Drystone Italia S.P.A": 0.9,
    "Drystone Spain Co": 0.8,
    "Drystone US Inc": 0.7,
    "Drystone Ireland Ltd": 0.6,
    "Drystone UK Ltd": 0.5
}

# Define KPIs
def is_on_time_delivery(case_data):
    """Determine if a case had on-time delivery based on total process time"""
    if "Create Delivery" not in case_data["activity"].values:
        return False
    
    start_time = case_data[case_data["activity"] == "Receive Purchase Order"]["timestamp"].min()
    delivery_time = case_data[case_data["activity"] == "Create Delivery"]["timestamp"].max()
    
    # Calculate SLA based on company
    company = case_data["company"].iloc[0]
    base_sla = 5  # Base SLA in days
    company_factor = COMPANY_LEAD_TIME_FACTORS.get(company, 1.0)
    sla = base_sla * company_factor
    
    actual_days = (delivery_time - start_time).total_seconds() / (24 * 3600)
    return actual_days <= sla

def generate_event_log():
    """Generate synthetic event log data for process mining"""
    event_log = []
    case_attributes = []
    
    for case_id in range(1, NUM_CASES + 1):
        # Generate case attributes
        case_uuid = str(uuid.uuid4())
        company = random.choices(list(COMPANIES.keys()), k=1)[0]
        region = COMPANIES[company]
        material_group = random.choice(MATERIAL_GROUPS)
        payment_term = random.choice(PAYMENT_TERMS)
        
        # Select process variant based on probabilities
        variant = random.choices(
            list(VARIANT_PROBABILITIES.keys()),
            weights=list(VARIANT_PROBABILITIES.values()),
            k=1
        )[0]
        
        activities = PROCESS_VARIANTS[variant]
        
        # Generate start time for the case
        start_time = START_DATE + timedelta(
            days=random.randint(0, (END_DATE - START_DATE).days)
        )
        
        # Generate events for the case
        current_time = start_time
        case_events = []
        
        for activity in activities:
            # Calculate activity duration based on company factor
            mean_duration, std_duration = ACTIVITY_DURATIONS[activity]
            company_factor = COMPANY_LEAD_TIME_FACTORS.get(company, 1.0)
            adjusted_mean = mean_duration * company_factor
            adjusted_std = std_duration * company_factor
            
            # Add some randomness to the duration
            duration = max(0.01, np.random.normal(adjusted_mean, adjusted_std))
            
            # Create event
            event = {
                "case_id": case_uuid,
                "activity": activity,
                "timestamp": current_time,
                "company": company,
                "region": region,
                "material_group": material_group,
                "payment_term": payment_term,
                "variant": variant
            }
            case_events.append(event)
            
            # Update current time for next activity
            current_time += timedelta(days=duration)
        
        # Add events to event log
        event_log.extend(case_events)
        
        # Create case attributes record
        case_df = pd.DataFrame(case_events)
        on_time_delivery = is_on_time_delivery(case_df)
        
        case_attr = {
            "case_id": case_uuid,
            "company": company,
            "region": region,
            "material_group": material_group,
            "payment_term": payment_term,
            "variant": variant,
            "start_time": start_time,
            "end_time": current_time,
            "case_duration": (current_time - start_time).total_seconds() / (24 * 3600),
            "on_time_delivery": on_time_delivery
        }
        case_attributes.append(case_attr)
    
    # Convert to DataFrames
    event_df = pd.DataFrame(event_log)
    case_df = pd.DataFrame(case_attributes)
    
    return event_df, case_df

def main():
    """Main function to generate and save event log data"""
    print("Generating event log data...")
    event_df, case_df = generate_event_log()
    
    # Save to CSV files
    event_df.to_csv("process_mining_solution/data/event_log.csv", index=False)
    case_df.to_csv("process_mining_solution/data/case_attributes.csv", index=False)
    
    print(f"Generated {len(event_df)} events across {len(case_df)} cases")
    print(f"Event log saved to process_mining_solution/data/event_log.csv")
    print(f"Case attributes saved to process_mining_solution/data/case_attributes.csv")
    
    # Print some statistics
    print("\nEvent log statistics:")
    print(f"Number of events: {len(event_df)}")
    print(f"Number of cases: {len(case_df)}")
    print(f"Number of activities: {event_df['activity'].nunique()}")
    print(f"Number of companies: {event_df['company'].nunique()}")
    print(f"Date range: {event_df['timestamp'].min()} to {event_df['timestamp'].max()}")
    
    print("\nProcess variants:")
    variant_counts = case_df['variant'].value_counts()
    for variant, count in variant_counts.items():
        print(f"  {variant}: {count} cases ({count/len(case_df)*100:.1f}%)")
    
    print("\nOn-time delivery performance:")
    on_time_counts = case_df['on_time_delivery'].value_counts()
    on_time_percentage = on_time_counts.get(True, 0) / len(case_df) * 100
    print(f"  On-time: {on_time_counts.get(True, 0)} cases ({on_time_percentage:.1f}%)")
    print(f"  Late: {on_time_counts.get(False, 0)} cases ({100-on_time_percentage:.1f}%)")

if __name__ == "__main__":
    main()
