'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import BPMNProcessModel from '../../components/BPMNProcessModel';

export default function ProcessModeling() {
  // Define the BPMN process model data
  const processModel = {
    lanes: [
      {
        id: 'lane-sales',
        name: 'Sales',
        activities: [
          {
            id: 'start-event',
            name: 'Start',
            type: 'start',
            position: { x: 50, y: 60 }
          },
          {
            id: 'receive-purchase-order',
            name: 'Receive Purchase Order',
            type: 'task',
            position: { x: 100, y: 40 },
            width: 150,
            height: 60
          }
        ]
      },
      {
        id: 'lane-order-management',
        name: 'Order Management',
        activities: [
          {
            id: 'create-sales-order',
            name: 'Create Sales Order',
            type: 'task',
            position: { x: 100, y: 40 },
            width: 150,
            height: 60
          },
          {
            id: 'gateway-1',
            name: 'Gateway',
            type: 'gateway',
            position: { x: 300, y: 55 }
          },
          {
            id: 'change-net-price',
            name: 'Change Net Price in Sales Order',
            type: 'task',
            position: { x: 380, y: 40 },
            width: 150,
            height: 60
          }
        ]
      },
      {
        id: 'lane-delivery',
        name: 'Delivery',
        activities: [
          {
            id: 'gateway-2',
            name: 'Gateway',
            type: 'gateway',
            position: { x: 300, y: 55 }
          },
          {
            id: 'create-delivery',
            name: 'Create Delivery',
            type: 'task',
            position: { x: 380, y: 40 },
            width: 150,
            height: 60
          },
          {
            id: 'create-shipment',
            name: 'Create Shipment',
            type: 'task',
            position: { x: 580, y: 40 },
            width: 150,
            height: 60
          },
          {
            id: 'issue-goods',
            name: 'Issue Goods',
            type: 'task',
            position: { x: 780, y: 40 },
            width: 150,
            height: 60
          }
        ]
      },
      {
        id: 'lane-finance',
        name: 'Finance',
        activities: [
          {
            id: 'create-invoice',
            name: 'Create Invoice',
            type: 'task',
            position: { x: 380, y: 40 },
            width: 150,
            height: 60
          },
          {
            id: 'clear-invoice',
            name: 'Clear Invoice',
            type: 'task',
            position: { x: 580, y: 40 },
            width: 150,
            height: 60
          },
          {
            id: 'end-event',
            name: 'End',
            type: 'end',
            position: { x: 780, y: 60 }
          }
        ]
      }
    ],
    connections: [
      { source: 'start-event', target: 'receive-purchase-order' },
      { source: 'receive-purchase-order', target: 'create-sales-order' },
      { source: 'create-sales-order', target: 'gateway-1' },
      { source: 'gateway-1', target: 'change-net-price' },
      { source: 'gateway-1', target: 'gateway-2' },
      { source: 'change-net-price', target: 'gateway-2' },
      { source: 'gateway-2', target: 'create-delivery' },
      { source: 'create-delivery', target: 'create-shipment' },
      { source: 'create-shipment', target: 'issue-goods' },
      { source: 'issue-goods', target: 'create-invoice' },
      { source: 'create-invoice', target: 'clear-invoice' },
      { source: 'clear-invoice', target: 'end-event' }
    ]
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">BPMN Process Modeling</h1>
        <p className="text-gray-600">
          Visualize and analyze your business process using BPMN notation
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4">Order-to-Cash Process Model</h3>
        <BPMNProcessModel 
          lanes={processModel.lanes}
          connections={processModel.connections}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Process Model Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Process Overview</h4>
            <p className="text-gray-700 mb-4">
              This BPMN diagram represents the order-to-cash process with four swimlanes representing different departments: Sales, Order Management, Delivery, and Finance. The process begins with receiving a purchase order and ends with clearing an invoice.
            </p>
            <h4 className="font-medium mb-2">Key Activities</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Receive Purchase Order (Sales)</li>
              <li>Create Sales Order (Order Management)</li>
              <li>Change Net Price in Sales Order (Order Management)</li>
              <li>Create Delivery (Delivery)</li>
              <li>Create Shipment (Delivery)</li>
              <li>Issue Goods (Delivery)</li>
              <li>Create Invoice (Finance)</li>
              <li>Clear Invoice (Finance)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Decision Points</h4>
            <p className="text-gray-700 mb-4">
              The process includes two gateway decision points:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>After Create Sales Order: Determines whether a price change is needed</li>
              <li>Before Create Delivery: Merges the paths with and without price changes</li>
            </ul>
            <h4 className="font-medium mb-2">Process Improvement Opportunities</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Reduce the frequency of price changes to streamline the process</li>
              <li>Automate the delivery creation step to reduce manual intervention</li>
              <li>Implement parallel processing for shipment and invoice creation</li>
              <li>Add validation steps to reduce errors and rework</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
