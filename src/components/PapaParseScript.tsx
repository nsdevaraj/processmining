// Add papaparse via CDN in the HTML head
import Script from 'next/script';

export default function PapaParseScript() {
  return (
    <Script
      src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js"
      strategy="beforeInteractive"
    />
  );
}
