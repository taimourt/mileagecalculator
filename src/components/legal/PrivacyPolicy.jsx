import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2, Globe, Mail } from 'lucide-react';

export default function PrivacyPolicy({ onNavigate }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold mb-3">
          <Shield className="w-3.5 h-3.5" />
          Data Protection & Privacy Standards
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Effective Date: November 1, 2026 &bull; Last Updated: November 22, 2026
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
          At <strong>Mileage Calculator Pro</strong> (accessible from <a href="https://www.mileagecalculatorpro.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">https://www.mileagecalculatorpro.com</a>), your privacy is one of our primary priorities. This Privacy Policy document outlines the types of information that is collected and recorded by Mileage Calculator Pro and how we use it.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors space-y-8 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            1. Client-Side Privacy Architecture
          </h2>
          <p>
            Unlike traditional web applications that transmit sensitive travel itineraries to remote databases, <strong>Mileage Calculator Pro operates on a client-side architecture</strong>. 
          </p>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2 text-xs text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              What stays in your browser:
            </div>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Odometer readings, trip distances, and fuel purchase amounts</li>
              <li>Business mileage logs, client names, and reimbursement entries</li>
              <li>Custom fuel price inputs, lease parameters, and vehicle presets</li>
              <li>Calculation history stored locally in your browser's <code className="font-mono">localStorage</code></li>
            </ul>
            <p className="pt-1">
              None of this calculation data is ever collected, stored, or processed on our backend servers.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            2. Google AdSense & Third-Party Advertising
          </h2>
          <p>
            We partner with Google AdSense to display advertisements when you visit our website. Google and other third-party vendors use cookies to serve ads based on a user's prior visits to this website or other websites on the internet.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>DoubleClick DART Cookie:</strong> Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to Mileage Calculator Pro and/or other sites on the Internet.
            </li>
            <li>
              <strong>Opting Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 font-medium underline">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 font-medium underline">aboutads.info</a>.
            </li>
            <li>
              We do not provide any personally identifiable information (PII) to advertising partners.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-600" />
            3. Cookies, Web Beacons & Analytics
          </h2>
          <p>
            Mileage Calculator Pro uses standard cookies to store information about visitors' preferences, including the user's chosen language, measurement unit system (US vs. Metric), dark/light theme, and calculation history.
          </p>
          <p>
            We also use Google Tag Manager and standard web analytics to monitor aggregate website traffic, page responsiveness, and technical errors. These tools collect non-personally identifiable metrics such as browser type, operating system, referring pages, and timestamp.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            4. Third-Party Geospatial Services
          </h2>
          <p>
            When calculating driving routes or searching for addresses, your browser connects directly to open geospatial APIs:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>OpenStreetMap & Nominatim:</strong> Used for public geocoding and map tile rendering.</li>
            <li><strong>Project OSRM:</strong> Used to compute highway driving routing polylines.</li>
          </ul>
          <p>
            These requests are subject to the respective privacy policies of OpenStreetMap and the Open Source Routing Machine project.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            5. GDPR & CCPA / CPRA Privacy Rights
          </h2>
          <p>
            We respect the privacy rights of all visitors, including those protected under the European Union General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA/CPRA).
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>Right to Know / Access:</strong> You have the right to request what data we have collected about you. As noted, we do not store personal profiles or database records.</li>
            <li><strong>Right to Deletion:</strong> You can delete all locally stored calculation logs, theme preferences, and presets at any time by clearing your browser's site data or clicking the "Clear All" button in our history panel.</li>
            <li><strong>Right to Non-Discrimination:</strong> We will never discriminate against any user for exercising their privacy rights.</li>
            <li><strong>Do Not Sell My Personal Information:</strong> We do not sell, rent, or trade your personal information to third parties.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-600" />
            6. Contact Our Privacy Team
          </h2>
          <p>
            If you have questions or suggestions regarding our Privacy Policy or data practices, please contact us at:
          </p>
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <p className="font-semibold text-slate-800 dark:text-slate-200">Mileage Calculator Pro Privacy Officer</p>
            <p className="text-xs text-slate-500 mt-0.5">Email: <a href="mailto:support@mileagecalculatorpro.com" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">support@mileagecalculatorpro.com</a></p>
            <p className="text-xs text-slate-500">Website: <a href="https://www.mileagecalculatorpro.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">https://www.mileagecalculatorpro.com</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}
