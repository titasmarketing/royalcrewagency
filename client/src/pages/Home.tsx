import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Calendar, Users, TrendingUp, FileText, Package } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/royal-crew-logo.jpeg" alt="Royal Crew Agency" className="h-12 w-12 rounded-lg" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Royal Crew Agency</h1>
                <p className="text-xs text-muted-foreground">GOD MODE Platform</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground">Olá, {user?.name}</span>
                  {user?.role === 'admin' && (
                    <Button asChild variant="default">
                      <Link href="/admin">Painel Admin</Link>
                    </Button>
                  )}
                  {user?.role === 'staff' && (
                    <Button asChild variant="default">
                      <Link href="/staff">Minha Área</Link>
                    </Button>
                  )}
                  {user?.role === 'client' && (
                    <Button asChild variant="default">
                      <Link href="/client">Meus Eventos</Link>
                    </Button>
                  )}
                </>
              ) : (
                <Button asChild variant="default">
                  <a href={getLoginUrl()}>Entrar</a>
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Crown className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent-foreground">Plataforma Premium de Gestão de Eventos</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Gestão de Eventos em
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"> Modo Deus</span>
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

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar eventos de forma profissional e eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Calendário Mestre</CardTitle>
                <CardDescription>
                  Visualização multi-view com drag-and-drop, detecção de conflitos e escala de equipe em tempo real
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Gestão de Staff</CardTitle>
                <CardDescription>
                  Sistema de convites estilo Uber, disponibilidade automática e matchmaking inteligente por geolocalização
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>CMS Dinâmico</CardTitle>
                <CardDescription>
                  Criação automática de páginas de serviços, sincronização em tempo real e SEO otimizado
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Documentos Automáticos</CardTitle>
                <CardDescription>
                  Geração de contratos, ordens de serviço e notas fiscais em PDF com dados do banco
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Gestão de Estoque</CardTitle>
                <CardDescription>
                  Kits de insumos por serviço, baixa automática e alertas de estoque mínimo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Crown className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Portal do Cliente</CardTitle>
                <CardDescription>
                  Tracking em tempo real da equipe, status do evento e área financeira completa
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <div className="text-muted-foreground">Automação</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">Real-time</div>
              <div className="text-muted-foreground">Sincronização</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">IA</div>
              <div className="text-muted-foreground">Matchmaking</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">Premium</div>
              <div className="text-muted-foreground">Interface</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/royal-crew-logo.jpeg" alt="Royal Crew Agency" className="h-8 w-8 rounded" />
              <span className="text-sm text-muted-foreground">© 2025 Royal Crew Agency. Todos os direitos reservados.</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent-foreground">GOD MODE Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
