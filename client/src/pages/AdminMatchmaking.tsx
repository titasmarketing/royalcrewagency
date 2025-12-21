import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Search, Star, MapPin, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function AdminMatchmaking() {
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [requiredRole, setRequiredRole] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!eventDate || !location || !requiredRole) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSearching(true);

    // Simular busca de matchmaking
    setTimeout(() => {
      const mockMatches = [
        {
          staffId: 1,
          name: "João Silva",
          score: 95,
          rating: 4.9,
          hourlyRate: "150.00",
          matchReasons: [
            "Disponível na data solicitada",
            "Avaliação excelente (4.9⭐)",
            "Especialista em: Garçom Premium",
            "Localização favorável",
            "Ótimo custo-benefício",
          ],
        },
        {
          staffId: 2,
          name: "Maria Santos",
          score: 88,
          rating: 4.7,
          hourlyRate: "140.00",
          matchReasons: [
            "Disponível na data solicitada",
            "Avaliação excelente (4.7⭐)",
            "Especialista em: Bartender",
            "Localização favorável",
          ],
        },
        {
          staffId: 3,
          name: "Pedro Costa",
          score: 82,
          rating: 4.5,
          hourlyRate: "130.00",
          matchReasons: [
            "Disponível na data solicitada",
            "Avaliação excelente (4.5⭐)",
            "Localização favorável",
            "Ótimo custo-benefício",
          ],
        },
      ];

      setMatches(mockMatches);
      setSearching(false);
      toast.success(`${mockMatches.length} profissionais encontrados!`);
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-gray-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: "Excelente Match", variant: "default" as const };
    if (score >= 75) return { label: "Bom Match", variant: "secondary" as const };
    if (score >= 60) return { label: "Match Razoável", variant: "outline" as const };
    return { label: "Match Fraco", variant: "destructive" as const };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Matchmaking Inteligente</h1>
          <p className="text-muted-foreground">
            Encontre os melhores profissionais para cada evento usando algoritmo de pontuação
          </p>
        </div>

        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle>Critérios de Busca</CardTitle>
            <CardDescription>
              Defina os requisitos do evento para encontrar os profissionais ideais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Data do Evento *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localização *</Label>
                <Input
                  id="location"
                  placeholder="Ex: São Paulo, SP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função Necessária *</Label>
                <Select value={requiredRole} onValueChange={setRequiredRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="garcom">Garçom</SelectItem>
                    <SelectItem value="bartender">Bartender</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                    <SelectItem value="coordenador">Coordenador</SelectItem>
                    <SelectItem value="seguranca">Segurança</SelectItem>
                    <SelectItem value="recepcionista">Recepcionista</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Orçamento Máximo/Hora</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="R$ 0.00"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={handleSearch} disabled={searching} className="w-full md:w-auto gap-2">
                <Search className="h-4 w-4" />
                {searching ? "Buscando..." : "Buscar Profissionais"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {matches.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                Resultados ({matches.length} profissionais)
              </h2>
              <p className="text-sm text-muted-foreground">
                Ordenados por pontuação de compatibilidade
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {matches.map((match, index) => {
                const scoreBadge = getScoreBadge(match.score);
                return (
                  <Card key={match.staffId} className="border-2 hover:border-accent/50 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                              #{index + 1}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{match.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{match.rating}</span>
                                </div>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">
                                  R$ {parseFloat(match.hourlyRate).toFixed(2)}/hora
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getScoreColor(match.score)}`}>
                            {match.score}
                          </div>
                          <Badge variant={scoreBadge.variant} className="mt-1">
                            {scoreBadge.label}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Motivos do Match:</p>
                        <ul className="space-y-1">
                          {match.matchReasons.map((reason: string, idx: number) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-accent">✓</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button size="sm" className="gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Convidar para Evento
                        </Button>
                        <Button size="sm" variant="outline">
                          Ver Perfil Completo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {matches.length === 0 && !searching && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Defina os critérios de busca para encontrar os melhores profissionais
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
