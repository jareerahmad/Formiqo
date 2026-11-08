
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  ReceiptText,
  UserRound,
  Mail,
  FileCheck2,
  BriefcaseBusiness,
  ShoppingCart,
  Wallet,
  BellRing,
  ClipboardList,
  FileSignature,
  Award,
  Clock3,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

const documentTypes = [
  {
    title: "Invoice",
    description: "Create professional invoices and clearly itemize payments.",
    href: "/create-invoice",
    icon: ReceiptText,
    category: "Finance",
    available: true,
  },
  {
    title: "CV / Resume",
    description: "Present your experience, education, and skills professionally.",
    href: "/create-cv",
    icon: UserRound,
    category: "Career",
    available: true,
  },
  {
    title: "Formal Letter",
    description: "Prepare polished letters for personal and professional use.",
    href: "/create-letter",
    icon: FileText,
    category: "Writing",
    available: true,
  },
  {
    title: "Quotation",
    description: "Share itemized prices and estimates with your customers.",
    href: "/create-quotation",
    icon: FileCheck2,
    category: "Business",
    available: true,
  },
  {
    title: "Receipt",
    description: "Create a clear record of a payment received.",
    href: "/create-receipt",
    icon: ReceiptText,
    category: "Finance",
    available: true,
  },
  {
    title: "Cover Letter",
    description: "Introduce yourself when applying for a job opportunity.",
    href: "/create-cover-letter",
    icon: FileSignature,
    category: "Career",
    available: true,
  },
  {
    title: "Business Proposal",
    description: "Present your services, plan, and business offer to clients.",
    href: "/create-business-proposal",
    icon: BriefcaseBusiness,
    category: "Business",
    available: true,
  },
  {
    title: "Purchase Order",
    description: "Prepare purchase details for suppliers and vendors.",
    href: "/create-purchase-order",
    icon: ShoppingCart,
    category: "Business",
    available: true,
  },
  {
    title: "Expense Report",
    description: "Organize expenses and summarize business spending.",
    href: "/create-expense-report",
    icon: Wallet,
    category: "Finance",
    available: true,
  },
  {
    title: "Payment Reminder",
    description: "Draft a courteous reminder for an outstanding payment.",
    href: "/create-payment-reminder",
    icon: BellRing,
    category: "Finance",
    available: true,
  },
  {
    title: "Meeting Minutes",
    description: "Record attendees, decisions, and important action items.",
    href: "/create-meeting-minutes",
    icon: ClipboardList,
    category: "Business",
    available: true,
  },
  {
    title: "Resignation Letter",
    description: "Write a respectful and professional resignation letter.",
    href: "/create-resignation-letter",
    icon: FileSignature,
    category: "Career",
    available: true,
  },
  {
    title: "Formal Email",
    description: "Draft emails for clients, universities, job applications, and more.",
    href: "/create-formal-email",
    icon: Mail,
    category: "Writing",
    available: true,
  },
  {
    title: "Certificate",
    description: "Prepare experience, internship, and completion certificates.",
    href: "/create-certificate",
    icon: Award,
    category: "Business",
    available: true,
  },
];

const categories = ["All tools", "Business", "Finance", "Career", "Writing"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-emerald-50 blur-3xl" />

        <div className="relative mx-auto flex min-h-[440px] max-w-7xl flex-col items-center justify-center px-4 py-12 text-center sm:min-h-[480px] sm:px-6 sm:py-14 lg:min-h-[500px] lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
            <Sparkles size={16} />
            Your all-in-one document workspace
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.12] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
            Professional documents,
            <span className="mt-2 block text-emerald-600">
              made remarkably simple.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
            Create invoices, CVs, quotations, formal emails, certificates, and more.
            Everything you need to prepare polished documents, all in one place.
          </p>

          <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="#tools"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/15 transition hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              Explore document tools
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/documents"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <FileText size={18} />
              My Documents
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-gray-500">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={17} className="text-emerald-600" />
              Simple and organized
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block" />

            <span className="inline-flex items-center gap-2">
              <Zap size={17} className="text-emerald-600" />
              14 document tools
            </span>
          </div>
        </div>
      </section>

      <section id="tools" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                Document library
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                What would you like to create?
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                Choose a tool for your next task. Available tools can be opened
                now, while the remaining tools will be introduced as they are
                built.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600">
              <FileText size={16} className="text-emerald-600" />
              14 document tools
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <a
                key={category}
                href={
                  category === "All tools"
                    ? "#tools-grid"
                    : `#category-${category.toLowerCase()}`
                }
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${category === "All tools"
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-700"
                  }`}
              >
                {category}
              </a>
            ))}
          </div>

          <div id="tools-grid" className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {documentTypes.map((tool) => {
              const Icon = tool.icon;

              return (
                <article
                  key={tool.title}
                  id={`category-${tool.category.toLowerCase()}`}
                  className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon size={23} strokeWidth={1.9} />
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${tool.available
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {tool.available ? "Available now" : "Coming soon"}
                    </span>
                  </div>

                  <div className="mt-5 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {tool.category}
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-gray-950">
                      {tool.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {tool.description}
                    </p>
                  </div>

                  {tool.available ? (
                    <Link
                      href={tool.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
                    >
                      Create document
                      <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                      />
                    </Link>
                  ) : (
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-400">
                      Coming in a future update
                      <Clock3 size={16} />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 rounded-3xl bg-emerald-50 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
                Keep everything organized
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-gray-950 sm:text-3xl">
                Return to your saved documents.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
                Open your document workspace to review your saved work as we
                continue building Formiqo.
              </p>
            </div>

            <Link
              href="/documents"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-bold text-white transition hover:bg-emerald-700"
            >
              View my documents
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
