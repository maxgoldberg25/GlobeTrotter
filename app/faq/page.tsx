'use client';

import Link from 'next/link';
import { useState } from 'react';
import PageContainer from '../components/PageContainer';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const faqs: FAQItem[] = [
    {
      question: "What is GlobeTrotter?",
      answer: "GlobeTrotter is a platform for travelers to share their journey experiences. You can upload photos, pin them on a map, and connect with fellow travelers who share your passion for exploration."
    },
    {
      question: "How do I create an account?",
      answer: "Click on the 'Get Started' button on the homepage, or navigate to the Sign Up page. Fill in your details including name, email, and password to create your account."
    },
    {
      question: "Is GlobeTrotter free to use?",
      answer: "Yes, GlobeTrotter is completely free to use. You can create an account, upload photos, and interact with other travelers at no cost."
    },
    {
      question: "How do I upload photos?",
      answer: "After logging in, navigate to the Upload page. You can drag and drop photos or click to select them from your device. Add a title, description, and location before submitting."
    },
    {
      question: "Can I edit or delete my photos?",
      answer: "Yes, you can edit or delete your photos by going to your profile page. Find the photo you want to modify, click on it, and you'll see options to edit or delete it."
    },
    {
      question: "How does the map feature work?",
      answer: "The interactive map shows photos pinned to their geographical locations. You can zoom in and out, click on pins to see the photos, and filter by various criteria like date or popularity."
    },
    {
      question: "Can I follow other travelers?",
      answer: "Yes, you can follow other travelers to see their uploads in your feed. Visit their profile and click the Follow button to start seeing their content."
    },
    {
      question: "How can I reset my password?",
      answer: "On the sign-in page, click on 'Forgot password?'. Enter your email address, and we'll send you instructions to reset your password."
    },
    {
      question: "Is my data secure?",
      answer: "We take data security seriously. Your personal information is encrypted, and we never share your data with third parties without your consent."
    },
    {
      question: "How can I contact support?",
      answer: "If you have any issues or questions, you can visit our Contact page or email us directly at support@globetrotter.com."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <PageContainer className="bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about GlobeTrotter
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 py-4' : 'max-h-0'
                }`}
              >
                <p className="px-6 text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">Didn't find what you were looking for?</p>
          <Link href="/contact">
            <button className="bg-primary text-white hover:bg-primary-dark px-6 py-2 rounded-md text-lg font-medium transition-colors">
              Contact Us
            </button>
          </Link>
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="text-primary hover:text-primary-dark font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </PageContainer>
  );
} 