import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Crown, LayoutDashboard, Star, MapPin, Users, CheckCircle, 
  Calendar, Clock, PartyPopper, ArrowRight, Zap, ShieldCheck,
  Award, TrendingUp, Package
} from "lucide-react";
import { Link } from "wouter";
import { useState, useRef } from "react";

export default function Home() {
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const workRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#001F3F] font-sans selection:bg-[#D4AF37] selection:text-white relative">
      
      {/* Navbar Royal */}
      <nav className="bg-[#001F3F]/90 backdrop-blur-md border-b border-[#D4AF37]/20 sticky top-0 z-50 py-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-20 items-center">
            <div className="flex flex-col items-center cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="text-[#D4AF37] mb-1"><Crown className="w-6 h-6" /></div>
              <span className="text-xl font-bold tracking-[0.2em] text-white uppercase">Royal Crew</span>
              <span className="text-[10px] tracking-[0.4em] text-[#D4AF37] -mt-1">EST. 2024</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-10">
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-[11px] uppercase tracking-[0.3em] font-bold text-white hover:text-[#D4AF37] transition-colors">Início</button>
              <button onClick={() => scrollTo(aboutRef)} className="text-[11px] uppercase tracking-[0.3em] font-bold text-white hover:text-[#D4AF37] transition-colors">A Agência</button>
              <button onClick={() => scrollTo(servicesRef)} className="text-[11px] uppercase tracking-[0.3em] font-bold text-white hover:text-[#D4AF37] transition-colors">Serviços</button>
              <button onClick={() => scrollTo(workRef)} className="text-[11px] uppercase tracking-[0.3em] font-bold text-white hover:text-[#D4AF37] transition-colors">Recrutamento</button>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/servicos">
                <Button variant="ghost" className="text-white hover:text-[#D4AF37] text-[10px] uppercase tracking-widest">
                  Serviços
                </Button>
              </Link>
              <Link href="/cliente">
                <Button className="flex items-center gap-2 text-[10px] h-11 bg-[#D4AF37] text-[#001F3F] hover:bg-[#D4AF37]/90">
                  <LayoutDashboard className="w-4 h-4" /> Portal do Cliente
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#001F3F] via-transparent to-[#001F3F]" />
        </div>
        
        <div className="relative z-10 px-6 max-w-7xl mx-auto w-full text-center">
          <div className="flex items-center gap-4 mb-8 justify-center">
            <div className="h-px w-12 bg-[#D4AF37]"></div>
            <Crown className="w-8 h-8 text-[#D4AF37]" />
            <div className="h-px w-12 bg-[#D4AF37]"></div>
          </div>
          <h1 className="text-5xl md:text-8xl font-light mb-8 tracking-[0.1em] text-white uppercase leading-tight">
            Gestão de Eventos em <br/><span className="text-[#D4AF37] font-bold">Modo Deus</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-300 font-light tracking-wide leading-relaxed italic max-w-3xl mx-auto">
            A plataforma all-in-one que integra CMS, CRM, ERP e gestão logística em tempo real para sua agência de eventos.
          </p>
          <div className="flex gap-6 items-center justify-center mb-12">
            <Link href="/servicos">
              <Button className="h-14 px-8 tracking-[0.3em] bg-[#D4AF37] text-[#001F3F] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all">
                Ver Serviços <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
            <Link href="/trabalhe-conosco">
              <Button variant="outline" className="h-14 px-8 tracking-[0.3em] border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#001F3F]">
                Trabalhe Conosco
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Eventos Realizados', value: '500+', icon: Calendar },
            { label: 'Profissionais Ativos', value: '200+', icon: Users },
            { label: 'Satisfação', value: '98%', icon: Star },
            { label: 'Clientes Premium', value: '50+', icon: Award },
          ].map((stat, i) => (
            <div key={i} className="text-center border-r border-gray-100 last:border-none">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-[#D4AF37]" />
              <p className="text-3xl font-bold text-[#001F3F] mb-1 tracking-tighter">{stat.value}</p>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* A Agência Section */}
      <section ref={aboutRef} className="py-32 bg-[#fcfcfc] relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" 
              alt="Luxury Agency" 
              className="relative rounded-2xl shadow-2xl z-10 w-full" 
            />
          </div>
          <div className="space-y-8">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.5em] uppercase block">Excelência Royal</span>
            <h2 className="text-5xl font-light text-[#001F3F] tracking-tight leading-tight">Onde a <span className="font-bold">Elegância</span> encontra o <span className="font-bold">Profissionalismo</span></h2>
            <p className="text-gray-600 leading-relaxed text-lg font-light">
              Não somos apenas uma agência de staffing. Somos o parceiro estratégico que garante que cada interação no seu evento reflita os padrões mais elevados de hospitalidade luxuosa.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              <div className="flex gap-4 items-start">
                <ShieldCheck className="text-[#D4AF37] w-6 h-6 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#001F3F] uppercase">Seguro e Verificado</h4>
                  <p className="text-xs text-gray-500 mt-1">Processo rigoroso de seleção e antecedentes.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Clock className="text-[#D4AF37] w-6 h-6 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#001F3F] uppercase">Suporte 24/7</h4>
                  <p className="text-xs text-gray-500 mt-1">Equipe disponível a qualquer momento.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <TrendingUp className="text-[#D4AF37] w-6 h-6 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#001F3F] uppercase">Matchmaking IA</h4>
                  <p className="text-xs text-gray-500 mt-1">Algoritmo inteligente de seleção de staff.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Package className="text-[#D4AF37] w-6 h-6 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#001F3F] uppercase">Gestão Completa</h4>
                  <p className="text-xs text-gray-500 mt-1">CMS, CRM, ERP integrados em uma plataforma.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Section */}
      <section ref={servicesRef} className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.5em] uppercase block mb-4">Nossos Serviços</span>
            <h2 className="text-5xl font-light text-[#001F3F] tracking-tight">Soluções <span className="font-bold">Premium</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Bartenders', icon: '🍸', desc: 'Mixologistas especializados' },
              { title: 'Garçons', icon: '🍽️', desc: 'Serviço de mesa impecável' },
              { title: 'Recepcionistas', icon: '👔', desc: 'Primeira impressão perfeita' },
              { title: 'Seguranças', icon: '🛡️', desc: 'Proteção discreta e eficiente' },
            ].map((service, i) => (
              <Card key={i} className="border-2 border-border hover:border-[#D4AF37] transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/20">
                <CardHeader>
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <CardTitle className="text-[#001F3F]">{service.title}</CardTitle>
                  <CardDescription>{service.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/servicos">
              <Button className="h-12 px-8 bg-[#D4AF37] text-[#001F3F] hover:bg-[#D4AF37]/90">
                Ver Todos os Serviços <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recrutamento Section */}
      <section ref={workRef} className="py-32 bg-[#001F3F]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Crown className="w-12 h-12 text-[#D4AF37] mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">Junte-se à <span className="font-bold text-[#D4AF37]">Elite</span></h2>
          <p className="text-xl text-gray-300 mb-10 font-light">
            Procuramos profissionais excepcionais para fazer parte da nossa equipe premium.
          </p>
          <Link href="/trabalhe-conosco">
            <Button className="h-14 px-10 tracking-[0.3em] bg-[#D4AF37] text-[#001F3F] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all">
              Candidatar-se Agora <ArrowRight className="w-4 h-4 ml-2 inline-block" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000814] text-gray-400 py-12 border-t border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-white font-bold tracking-wider">ROYAL CREW</span>
              </div>
              <p className="text-sm">A plataforma premium de gestão de eventos do Reino Unido.</p>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Serviços</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/servicos" className="hover:text-[#D4AF37] transition-colors">Nossos Serviços</Link></li>
                <li><Link href="/cliente" className="hover:text-[#D4AF37] transition-colors">Portal do Cliente</Link></li>
                <li><Link href="/trabalhe-conosco" className="hover:text-[#D4AF37] transition-colors">Trabalhe Conosco</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Empresa</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Contato</a></li>
                <li><Link href="/admin" className="hover:text-[#D4AF37] transition-colors">Admin</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2024 Royal Crew Agency. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
