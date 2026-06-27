import { Settings, Bell, Shield, CreditCard, User, ChevronRight } from "lucide-react";

const sections = [
  {
    icon: User,
    title: "Account Settings",
    description: "Manage your profile, name, and email",
    color: "indigo",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Password, two-factor authentication, and sessions",
    color: "emerald",
  },
  {
    icon: CreditCard,
    title: "Billing & Payments",
    description: "Subscription plan, invoices, and payment methods",
    color: "violet",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Email, SMS, and push notification preferences",
    color: "cyan",
  },
];

const colorMap = {
  indigo:  { bg: "bg-indigo-500/10",  text: "text-indigo-400" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  violet:  { bg: "bg-violet-500/10",  text: "text-violet-400" },
  cyan:    { bg: "bg-cyan-500/10",    text: "text-cyan-400" },
};

export default function SettingsPage() {
  return (
    <div className="space-y-7 animate-fadeIn max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center">
          <Settings className="text-slate-400" size={22} />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white">Settings</h2>
          <p className="text-slate-400 text-sm">Manage your account and preferences</p>
        </div>
      </div>

      {/* Setting tiles */}
      <div className="space-y-3">
        {sections.map(s => {
          const Icon = s.icon;
          const c    = colorMap[s.color];
          return (
            <button
              key={s.title}
              className="card w-full flex items-center gap-4 p-5 text-left hover:border-indigo-500/20 group transition-all duration-200"
            >
              <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={c.text} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white text-sm mb-0.5">{s.title}</p>
                <p className="text-slate-500 text-xs">{s.description}</p>
              </div>
              <ChevronRight size={18} className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>

      {/* Danger zone */}
      <div className="card p-6 border border-red-500/10">
        <h3 className="text-sm font-black text-red-400 mb-1">Danger Zone</h3>
        <p className="text-slate-500 text-xs mb-4">These actions are permanent and cannot be undone.</p>
        <button className="text-red-400 text-xs font-bold px-4 py-2 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-all">
          Delete Account
        </button>
      </div>
    </div>
  );
}