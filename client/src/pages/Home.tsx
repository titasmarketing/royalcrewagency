import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Calendar, 
  Users, 
  Star, 
  CheckCircle, 
  TrendingUp,
  Award,
  Shield,
  Zap,
  Heart,
  MapPin,
  Clock,
  DollarSign
} from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  const stats = [
    { value: "500+", label: "Eventos Realizados", icon: Calendar },
    { value: "200+", label: "Profissionais Ativos", icon: Users },
    { value: "98%", label: "Satisfação", icon: Star },
    { value: "50+", label: "Clientes Premium", icon: Award },
  ];

  const services = [
    {
      title: "Casamentos",
      description: "Equipe especializada para tornar seu dia inesquecível",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Eventos Corporativos",
      description: "Profissionais para conferências, lançamentos e networking",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Festas Privadas",
      description: "Aniversários, comemorações e celebrações exclusivas",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Galas & Premiações",
      description: "Serviço premium para eventos de alto padrão",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, Tech Innovations Ltd",
      content: "A Royal Crew transformou nosso evento corporativo em uma experiência memorável. Profissionalismo impecável!",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Michael & Emma",
      role: "Casamento - Junho 2024",
      content: "Nossa equipe foi perfeita! Atenciosos, pontuais e fizeram nosso casamento ser exatamente como sonhamos.",
      rating: 5,
      avatar: "M&E",
    },
    {
      name: "David Thompson",
      role: "Event Manager, Luxury Hotels",
      content: "Trabalhamos com a Royal Crew há 2 anos. Sempre entregam qualidade excepcional e equipes altamente treinadas.",
      rating: 5,
      avatar: "DT",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Profissionais Verificados",
      description: "Todos os membros passam por rigoroso processo de seleção e background check",
    },
    {
      icon: Zap,
      title: "Resposta Rápida",
      description: "Orçamento em até 24h e confirmação de equipe em tempo recorde",
    },
    {
      icon: Star,
      title: "Qualidade Garantida",
      description: "98% de satisfação dos clientes e avaliação média de 4.9/5 estrelas",
    },
    {
      icon: Clock,
      title: "Pontualidade",
      description: "Equipes sempre chegam 30min antes para garantir setup perfeito",
    },
    {
      icon: DollarSign,
      title: "Preço Justo",
      description: "Transparência total e melhor custo-benefício do mercado",
    },
    {
      icon: MapPin,
      title: "Cobertura Nacional",
      description: "Atendemos todo o Reino Unido com a mesma excelência",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Header/Navbar */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
              <Crown className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Royal Crew Agency</h1>
              <p className="text-xs text-muted-foreground">GOD MODE Platform</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/servicos">
              <Button variant="ghost">Services</Button>
            </Link>
            <Link href="/cliente">
              <Button variant="ghost">Client Portal</Button>
            </Link>
            {!isAuthenticated && (
              <Button asChild variant="outline">
                <a href={getLoginUrl()}>Login</a>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl">
          <div className="text-center">
            <Badge className="mb-6 gap-2" variant="outline">
              <Crown className="h-3 w-3" />
              Plataforma Premium de Gestão de Eventos
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Gestão de Eventos em Modo{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">
                Deus
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A plataforma all-in-one que integra CMS, CRM, ERP e gestão logística em tempo real para sua agência de eventos.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center justify-center gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/servicos">
                    <Crown className="h-4 w-4" />
                    Ver Serviços
                  </Link>
                </Button>
                <Button variant="outline" size="lg" onClick={() => (window.location.href = "/trabalhe-conosco")}>
                  Trabalhe Conosco
                </Button>
                {!isAuthenticated && (
                  <Button asChild size="lg" variant="outline">
                    <a href={getLoginUrl()}>Entrar</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-accent/5">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-accent" />
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Nossos Serviços</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Equipes especializadas para cada tipo de evento, garantindo excelência em todos os detalhes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <Card key={idx} className="border-2 hover:border-accent/50 transition-all cursor-pointer">
                  <CardContent className="pt-6">
                    <div className={`h-14 w-14 rounded-lg ${service.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-7 w-7 ${service.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline">
              <Link href="/servicos">Ver Todos os Serviços</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-accent/5">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Por Que Escolher a Royal Crew?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Diferenciais que nos tornam a escolha número 1 para eventos premium
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">O Que Nossos Clientes Dizem</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Depoimentos reais de quem confiou na Royal Crew para seus eventos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-accent/10 to-accent/5">
        <div className="container max-w-4xl text-center">
          <Crown className="h-16 w-16 text-accent mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Pronto para Elevar Seu Evento ao Próximo Nível?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como a Royal Crew pode transformar seu evento em uma experiência inesquecível
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="gap-2">
              <CheckCircle className="h-5 w-5" />
              Solicitar Orçamento
            </Button>
            <Button size="lg" variant="outline" onClick={() => (window.location.href = "/trabalhe-conosco")}>
              Junte-se à Equipe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-background">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                  <Crown className="h-5 w-5 text-accent-foreground" />
                </div>
                <span className="font-bold">Royal Crew</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Excelência em gestão de eventos desde 2020
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Weddings</li>
                <li>Corporate Events</li>
                <li>Private Parties</li>
                <li>Galas & Awards</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/trabalhe-conosco">Work With Us</Link></li>
                <li>About Us</li>
                <li>Contact</li>
                <li>Blog</li>
                <li><Link href="/admin" className="text-xs opacity-50 hover:opacity-100">Admin</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>London, United Kingdom</li>
                <li>contact@royalcrew.uk</li>
                <li>+44 20 1234 5678</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Royal Crew Agency. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
