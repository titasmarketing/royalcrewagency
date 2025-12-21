import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Crown, Package, ArrowLeft, Check } from "lucide-react";
import { Link, useParams } from "wouter";

export default function ServiceDetail() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { data: service, isLoading, error } = trpc.services.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Package className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Serviço não encontrado</h1>
        <p className="text-muted-foreground mb-8">O serviço que você procura não existe ou foi removido.</p>
        <Link href="/servicos">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Serviços
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="/royal-crew-logo.jpeg" alt="Royal Crew Agency" className="h-12 w-12 rounded-lg" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Royal Crew Agency</h1>
                  <p className="text-xs text-muted-foreground">GOD MODE Platform</p>
                </div>
              </div>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link href="/servicos">
                <Button variant="ghost">Serviços</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/servicos">Serviços</Link>
          <span>/</span>
          <span className="text-foreground">{service.name}</span>
        </div>
      </div>

      {/* Service Detail */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {service.isFeatured && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                      <Crown className="h-3 w-3 text-accent" />
                      <span className="text-xs font-medium text-accent-foreground">Em Destaque</span>
                    </div>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {service.name}
                </h1>
                {service.shortDescription && (
                  <p className="text-xl text-muted-foreground">
                    {service.shortDescription}
                  </p>
                )}
              </div>

              {service.description && (
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Sobre o Serviço</h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      {service.description.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">O que está incluído</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Equipe profissional especializada</p>
                        <p className="text-sm text-muted-foreground">Staff treinado e experiente</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Materiais e insumos de qualidade</p>
                        <p className="text-sm text-muted-foreground">Tudo que você precisa para o evento</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Gestão completa do serviço</p>
                        <p className="text-sm text-muted-foreground">Coordenação e supervisão durante todo o evento</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Suporte em tempo real</p>
                        <p className="text-sm text-muted-foreground">Acompanhamento e tracking do evento</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-2 border-accent/30">
                <CardContent className="pt-6 space-y-6">
                  {service.basePrice && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">A partir de</p>
                      <p className="text-4xl font-bold text-accent">
                        £ {parseFloat(service.basePrice).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Valor pode variar conforme o evento</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button className="w-full gap-2" size="lg">
                      <Crown className="h-4 w-4" />
                      Solicitar Orçamento
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      Falar com Especialista
                    </Button>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-foreground mb-3">Por que escolher a Royal Crew?</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Mais de 10 anos de experiência</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Equipe altamente qualificada</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Atendimento personalizado</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Garantia de qualidade</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-8 mt-16">
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
