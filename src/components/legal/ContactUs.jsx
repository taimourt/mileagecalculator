import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Clock, HelpCircle, MapPin } from 'lucide-react';

export default function ContactUs({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    
    // Simulate client-side submission confirmation
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold mb-3">
          <Mail className="w-3.5 h-3.5" />
          Get in Touch with Our Team
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Have a question about calculation formulas, found a bug in one of our tools, or have a suggestion for improving Mileage Calculator Pro? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info & Channels (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Direct Contact Channels
            </h2>
            
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <Mail className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Email Inquiries</div>
                  <a href="mailto:support@mileagecalculatorpro.com" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                    support@mileagecalculatorpro.com
                  </a>
                  <p className="text-[11px] text-slate-400 mt-0.5">We respond within 24–48 business hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Operating Hours</div>
                  <p>Monday – Friday: 9:00 AM – 6:00 PM EST</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Server monitors active 24/7.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <MapPin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Digital Headquarters</div>
                  <p>Mileage Calculator Pro Operations</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">United States & International Edge Network</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                Looking for Quick Answers?
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Check our <button onClick={() => onNavigate && onNavigate('faqs')} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">FAQs & Knowledge Base</button> for quick answers on IRS rates, MPG conversion math, and IFTA rules.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="md:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Message Received!
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Thank you for reaching out, <strong>{name}</strong>. Our team will review your inquiry and follow up at <strong>{email}</strong> within 24 to 48 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Send Us a Direct Message
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="General Inquiry">General Question / Inquiry</option>
                    <option value="Bug Report">Bug Report / Calculator Discrepancy</option>
                    <option value="Feature Request">Feature Request / Suggestion</option>
                    <option value="Advertising">Advertising / Google AdSense Partnership</option>
                    <option value="Data Privacy">Data Privacy / GDPR Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please describe your question or feedback in detail..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
