import { useState, useEffect } from "react";
import { Crown, Smartphone, Share, Plus, MoreVertical, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

type Platform = "ios" | "android" | "desktop" | "unknown";

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  if (/Windows|Mac|Linux/.test(ua)) return "desktop";
  return "unknown";
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export default function InstallApp() {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [installed, setInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setPlatform(detectPlatform());
    setInstalled(isStandalone());

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleAndroidInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferredPrompt(null);
    }
  };

  if (installed) {
    return (
      <div className="min-h-screen bg-[#0c1b33] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-[#D4AF37] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#0c1b33]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">App Installed!</h1>
          <p className="text-white/60 mb-6">Royal Crew Agency is ready on your home screen.</p>
          <Link href="/staff">
            <Button className="w-full bg-[#D4AF37] hover:bg-[#b8962e] text-[#0c1b33] font-semibold">
              Open Staff Portal
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c1b33] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg shadow-[#D4AF37]/20 border-2 border-[#D4AF37]/30">
          <img src="/manus-storage/royal-crew-logo-transparent_0418b250.png" alt="Royal Crew Agency" className="h-24 w-auto" />
        </div>
        <h1 className="text-2xl font-bold text-white">Royal Crew Agency</h1>
        <p className="text-[#D4AF37] text-sm mt-1 tracking-widest uppercase">Staff App</p>
      </div>

      {/* Platform Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setPlatform("ios")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            platform === "ios"
              ? "bg-[#D4AF37] text-[#0c1b33]"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          🍎 iPhone / iPad
        </button>
        <button
          onClick={() => setPlatform("android")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            platform === "android"
              ? "bg-[#D4AF37] text-[#0c1b33]"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          🤖 Android
        </button>
      </div>

      {/* iOS Instructions */}
      {platform === "ios" && (
        <Card className="bg-white/5 border-white/10 p-6 max-w-sm w-full">
          <h2 className="text-white font-semibold text-lg mb-4 text-center">
            Add to Home Screen
          </h2>
          <div className="space-y-4">
            {[
              {
                icon: <Share className="w-5 h-5 text-[#D4AF37]" />,
                step: "1",
                title: "Tap the Share button",
                desc: 'In Safari, tap the Share icon at the bottom of the screen (the square with an arrow pointing up).',
              },
              {
                icon: <Plus className="w-5 h-5 text-[#D4AF37]" />,
                step: "2",
                title: 'Select "Add to Home Screen"',
                desc: 'Scroll down in the share menu and tap "Add to Home Screen".',
              },
              {
                icon: <Crown className="w-5 h-5 text-[#D4AF37]" />,
                step: "3",
                title: "Confirm and Add",
                desc: 'Tap "Add" in the top right corner. The Royal Crew app will appear on your home screen.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{item.title}</p>
                  <p className="text-white/50 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual hint */}
          <div className="mt-5 p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-center">
            <p className="text-[#D4AF37] text-xs font-medium">
              ⚠️ Must be opened in <strong>Safari</strong> — not Chrome or other browsers
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-white/40 text-xs">
            <Smartphone className="w-4 h-4" />
            <span>Works on iOS 16.4+ for full GPS support</span>
          </div>
        </Card>
      )}

      {/* Android Instructions */}
      {platform === "android" && (
        <Card className="bg-white/5 border-white/10 p-6 max-w-sm w-full">
          <h2 className="text-white font-semibold text-lg mb-4 text-center">
            Install App
          </h2>

          {deferredPrompt ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <p className="text-white/70 text-sm mb-5">
                Tap the button below to install the Royal Crew app directly on your Android device. No app store required.
              </p>
              <Button
                onClick={handleAndroidInstall}
                className="w-full bg-[#D4AF37] hover:bg-[#b8962e] text-[#0c1b33] font-bold text-base py-6"
              >
                <Download className="w-5 h-5 mr-2" />
                Install Royal Crew App
              </Button>
              <p className="text-white/30 text-xs mt-3">Free · No account needed to install</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                {
                  icon: <MoreVertical className="w-5 h-5 text-[#D4AF37]" />,
                  step: "1",
                  title: "Open browser menu",
                  desc: 'Tap the three-dot menu (⋮) in the top right corner of Chrome.',
                },
                {
                  icon: <Plus className="w-5 h-5 text-[#D4AF37]" />,
                  step: "2",
                  title: '"Add to Home screen"',
                  desc: 'Tap "Add to Home screen" or "Install app" from the menu.',
                },
                {
                  icon: <Crown className="w-5 h-5 text-[#D4AF37]" />,
                  step: "3",
                  title: "Confirm installation",
                  desc: "Tap Install to add Royal Crew to your home screen.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{item.title}</p>
                    <p className="text-white/50 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="mt-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                <p className="text-blue-300 text-xs">
                  💡 Use <strong>Chrome</strong> or <strong>Edge</strong> for the best install experience
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Desktop */}
      {(platform === "desktop" || platform === "unknown") && (
        <Card className="bg-white/5 border-white/10 p-6 max-w-sm w-full text-center">
          <Smartphone className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
          <h2 className="text-white font-semibold text-lg mb-2">Open on Mobile</h2>
          <p className="text-white/60 text-sm mb-4">
            Scan the QR code or open this page on your iPhone or Android device to install the app.
          </p>
          <div className="bg-white rounded-xl p-4 inline-block mx-auto mb-4">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/install')}&color=0c1b33&bgcolor=ffffff`}
              alt="QR Code"
              className="w-36 h-36"
            />
          </div>
          <p className="text-white/30 text-xs">Point your phone camera at the QR code</p>
        </Card>
      )}

      {/* Bottom link */}
      <div className="mt-6 text-center">
        <Link href="/staff">
          <button className="text-white/40 text-sm hover:text-white/70 transition-colors underline underline-offset-4">
            Continue in browser instead
          </button>
        </Link>
      </div>
    </div>
  );
}
