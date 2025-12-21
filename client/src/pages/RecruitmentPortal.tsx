import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Crown, CheckCircle, Users, DollarSign, Calendar, Star } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function RecruitmentPortal() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",

    address: "",
    city: "",
    state: "",
    bio: "",
    experience: "",
    specialties: [] as string[],
    hourlyRate: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const createApplicationMutation = trpc.recruitment.createApplication.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Cadastro enviado com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao enviar cadastro: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    createApplicationMutation.mutate(formData);
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const availableSpecialties = [
    "Garçom",
    "Bartender",
    "Chef",
    "Auxiliar de Cozinha",
    "Coordenador",
    "Recepcionista",
    "Segurança",
    "Valet",
    "Limpeza",
    "Montagem/Desmontagem",
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-2 border-accent/20">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Cadastro Enviado com Sucesso!
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Obrigado por se candidatar à Royal Crew Agency. Nossa equipe irá analisar seu perfil e
              entraremos em contato em breve.
            </p>
            <div className="bg-accent/10 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-2">Próximos Passos:</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-accent">1.</span>
                  <span>Análise do seu perfil pela nossa equipe (1-2 dias úteis)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">2.</span>
                  <span>Entrevista online ou presencial (se aprovado)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">3.</span>
                  <span>Treinamento e integração à equipe</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">4.</span>
                  <span>Início das oportunidades de trabalho!</span>
                </li>
              </ul>
            </div>
            <Button onClick={() => (window.location.href = "/")} size="lg">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Header */}
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
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Voltar para Home
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
              <Crown className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Trabalhe Conosco</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Faça Parte da Equipe <span className="text-accent">Premium</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Junte-se aos melhores profissionais de eventos do mercado. Trabalhe em eventos exclusivos,
              ganhe bem e construa sua carreira com a Royal Crew Agency.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-1">Ótima Remuneração</h3>
                <p className="text-sm text-muted-foreground">Valores acima da média do mercado</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-1">Flexibilidade</h3>
                <p className="text-sm text-muted-foreground">Você escolhe quando trabalhar</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-1">Eventos Premium</h3>
                <p className="text-sm text-muted-foreground">Trabalhe em eventos exclusivos</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-1">Equipe Top</h3>
                <p className="text-sm text-muted-foreground">Trabalhe com os melhores</p>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Formulário de Cadastro</CardTitle>
              <CardDescription>
                Preencha seus dados para se candidatar. Campos marcados com * são obrigatórios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informações Pessoais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        placeholder="João Silva"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="joao@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        placeholder="(11) 98765-4321"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>


                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        placeholder="Rua, número, complemento"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        placeholder="São Paulo"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        placeholder="SP"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informações Profissionais</h3>

                  <div className="space-y-2">
                    <Label>Especialidades / Funções *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSpecialties.map((specialty) => (
                        <div key={specialty} className="flex items-center space-x-2">
                          <Checkbox
                            id={specialty}
                            checked={formData.specialties.includes(specialty)}
                            onCheckedChange={() => handleSpecialtyToggle(specialty)}
                          />
                          <label
                            htmlFor={specialty}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {specialty}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experiência Profissional</Label>
                    <Textarea
                      id="experience"
                      placeholder="Descreva sua experiência em eventos, funções anteriores, tempo de atuação, etc."
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Sobre Você</Label>
                    <Textarea
                      id="bio"
                      placeholder="Conte um pouco sobre você, seus pontos fortes, disponibilidade, etc."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Pretensão Salarial (£/hora)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      placeholder="150.00"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2"
                    disabled={createApplicationMutation.isPending}
                  >
                    {createApplicationMutation.isPending ? (
                      "Enviando..."
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Enviar Cadastro
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Ao enviar este formulário, você concorda com nossos termos de uso e política de
                    privacidade.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
