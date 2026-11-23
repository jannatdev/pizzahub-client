

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  Pizza,
} from "lucide-react";

export default function ContactPage() {
  return (
    <main className="relative overflow-hidden bg-red-50/25 px-4 py-16 sm:px-6 lg:px-8">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-red-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-red-100/50 blur-3xl" />

      {/* Hero */}
      <section className="relative mx-auto mb-12 max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm">
          <Pizza size={18} />
          Contact PizzaHub
        </div>

        <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Get in <span className="text-red-600">Touch</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
          Have a question, feedback, or need help with your order?
          We would love to hear from you.
        </p>

        <div className="mx-auto mt-5 flex justify-center">
          <div className="h-1 w-20 rounded-full bg-red-500" />
        </div>
      </section>

      {/* Contact Content */}
      <section className="relative mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.4fr]">
        {/* Contact Information */}
        <div className="relative overflow-hidden rounded-3xl border border-red-100 bg-white/90 p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Contact Information
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Reach out to us through any of these channels.
          </p>

          <div className="mt-8 space-y-6">
            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Mail size={22} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <a
                  href="mailto:support@pizzahub.com"
                  className="mt-1 text-sm text-gray-500 transition hover:text-red-600"
                >
                  support@pizzahub.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Phone size={22} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">Phone</p>
                <a
                  href="tel:+8801234567890"
                  className="mt-1 text-sm text-gray-500 transition hover:text-red-600"
                >
                  +880 1234-567890
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <MapPin size={22} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">Location</p>
                <p className="mt-1 text-sm text-gray-500">
                  Dhaka, Bangladesh
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Clock size={22} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  Working Hours
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Everyday, 10 AM – 10 PM
                </p>
              </div>
            </div>
          </div>

          {/* Pizza decoration */}
          <div className="mt-10 flex items-center justify-between border-t border-red-100 pt-6">
            <p className="font-medium italic text-red-600">
              We&apos;re here to help!
            </p>

            <Pizza
              size={38}
              className="rotate-[-25deg] text-red-200"
            />
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-3xl border border-red-100 bg-white/90 p-6 shadow-sm sm:p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Send Us a Message
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Fill out the form below and we will get back to you soon.
          </p>

          <form className="mt-8 space-y-5">
            {/* Name and Email */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Subject
              </label>

              <div className="relative">
                <MessageSquare
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="What is this about?"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Write your message here..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-red-700 hover:shadow-md active:scale-[0.98]"
            >
              Send Message
              <Send size={18} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
