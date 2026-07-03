import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Crown, Package, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Services() {
  const { data: services, isLoading } = trpc.services.list.useQuery();
  const { data: featured } = trpc.services.featured.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="/uploads/images/gallery_1776897529584-r25iv.png" alt="Royal Crew Agency" className="h-12 w-auto" />
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
              <Link href="/services">
                <Button variant="default">Services</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Crown className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent-foreground">Services Premium</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nossos Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Soluções completas para tornar seu evento inesquecível
            </p>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {featured && featured.length > 0 && (
        <section className="py-12 bg-card/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Services em Destaque
              </h2>
              <p className="text-muted-foreground">Nossos serviços mais procurados</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((service) => (
                <Card key={service.id} className="border-2 border-accent/30 hover:border-accent/60 transition-all group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Crown className="h-6 w-6 text-accent fill-accent" />
                      {service.basePrice && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">A partir de</p>
                          <p className="text-lg font-bold text-accent">
                            £ {parseFloat(service.basePrice).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {service.shortDescription || service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/services/${service.slug}`}>
                      <Button className="w-full gap-2 group-hover:gap-3 transition-all">
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Services */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Todos os Services
            </h2>
            <p className="text-muted-foreground">Explore nosso catálogo completo</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Package className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : services && services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="border-2 hover:border-accent/50 transition-all group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Package className="h-6 w-6 text-accent" />
                      {service.basePrice && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">A partir de</p>
                          <p className="text-lg font-bold text-foreground">
                            £ {parseFloat(service.basePrice).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {service.shortDescription || service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/services/${service.slug}`}>
                      <Button variant="outline" className="w-full gap-2 group-hover:gap-3 transition-all">
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum serviço disponível no momento</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Pronto para começar?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Entre em contato conosco e descubra como podemos tornar seu evento extraordinário
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="gap-2">
                <Crown className="h-4 w-4" />
                Solicitar Orçamento
              </Button>
              <Button size="lg" variant="outline">
                Falar com Especialista
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/uploads/images/gallery_1776897529584-r25iv.png" alt="Royal Crew Agency" className="h-8 w-auto" />
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
