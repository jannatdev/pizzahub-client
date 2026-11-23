"use client";
import Link from "next/link";

import {
  FaPizzaSlice,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {

   
  return (
    <footer className="bg-[#250808] text-white mt-20">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="mb-5 flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500">
                <FaPizzaSlice className="text-2xl text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                Pizza<span className="text-orange-500">Hub</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-gray-400">
              Bringing happiness to your doorstep, one delicious slice
              at a time. Fresh ingredients, authentic flavors, and
              unforgettable pizza experiences.
            </p>

            <div className="mt-6 flex gap-3">
              {[
                { icon: <FaFacebookF />, href: "#" },
                { icon: <FaInstagram />, href: "#" },
                { icon: <FaTwitter />, href: "#" },
                { icon: <FaYoutube />, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label="Social media"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-300 transition-all duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold">
              Quick Links
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              {[
                ["Home", "/"],
                ["Browse Menus", "/browse-menu"],
                ["About Us", "/about"],
                ["My Orders", "/my-orders"],
                ["Contact Us", "/contact"],
              ].map(([name, href]) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="transition-colors hover:translate-x-1 hover:text-orange-500 inline-block duration-300"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold">
              Customer Support
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="/faq" className="hover:text-orange-500 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-orange-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-orange-500 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-orange-500 transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-lg font-bold">
              Get In Touch
            </h3>

            <ul className="space-y-5 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-orange-500" />
                <span>Dhaka, Bangladesh</span>
              </li>

              <li className="flex items-center gap-3">
                <FaPhoneAlt className="shrink-0 text-orange-500" />
                <a href="tel:+8801234567890" className="hover:text-orange-500">
                  +880 1234-567890
                </a>
              </li>

              <li className="flex items-center gap-3">
                <FaEnvelope className="shrink-0 text-orange-500" />
                <a href="mailto:support@pizzahub.com" className="hover:text-orange-500">
                  support@pizzahub.com
                </a>
              </li>
            </ul>

            <div className="mt-7">
              <p className="mb-3 text-sm font-semibold">
                Opening Hours
              </p>
              <p className="text-sm text-gray-400">
                Everyday: 10:00 AM - 11:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-14 border-t border-gray-800 pt-7">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-gray-500">
              © 2026 PizzaHub. All rights reserved.
            </p>

            <p className="text-sm text-gray-500">
              Made with <span className="text-red-500">♥</span> for pizza lovers.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
