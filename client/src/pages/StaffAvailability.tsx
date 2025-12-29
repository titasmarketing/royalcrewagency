import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarCheck, CalendarX, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function StaffAvailability() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [mode, setMode] = useState<"available" | "blocked">("available");

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (mode === "available") {
      // Remover da lista de bloqueados se existir
      setBlockedDates((prev) => prev.filter((d) => d.getTime() !== date.getTime()));
      
      // Add ou remover de disponíveis
      setSelectedDates((prev) => {
        const exists = prev.some((d) => d.getTime() === date.getTime());
        if (exists) {
          return prev.filter((d) => d.getTime() !== date.getTime());
        }
        return [...prev, date];
      });
    } else {
      // Remover da lista de disponíveis se existir
      setSelectedDates((prev) => prev.filter((d) => d.getTime() !== date.getTime()));
      
      // Add ou remover de bloqueados
      setBlockedDates((prev) => {
        const exists = prev.some((d) => d.getTime() === date.getTime());
        if (exists) {
          return prev.filter((d) => d.getTime() !== date.getTime());
        }
        return [...prev, date];
      });
    }
  };

  const handleSave = () => {
    // TODO: Save no banco de dados via tRPC
    toast.success("Availability atualizada com sucesso!");
  };

  const modifiers = {
    available: selectedDates,
    blocked: blockedDates,
  };

  const modifiersStyles = {
    available: {
      backgroundColor: "#22c55e",
      color: "white",
      fontWeight: "bold",
    },
    blocked: {
      backgroundColor: "#ef4444",
      color: "white",
      fontWeight: "bold",
      textDecoration: "line-through",
    },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Minha Availability</h1>
          <p className="text-muted-foreground">
            Gerencie suas datas disponíveis e bloqueadas para eventos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-green-600" />
                Datas Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{selectedDates.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarX className="h-4 w-4 text-red-600" />
                Datas Bloqueadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{blockedDates.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                Eventos Confirmados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Mode Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Modo de Seleção</CardTitle>
            <CardDescription>
              Escolha se deseja marcar datas como disponíveis ou bloqueadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={mode === "available" ? "default" : "outline"}
                onClick={() => setMode("available")}
                className="gap-2"
              >
                <CalendarCheck className="h-4 w-4" />
                Marcar Disponível
              </Button>
              <Button
                variant={mode === "blocked" ? "destructive" : "outline"}
                onClick={() => setMode("blocked")}
                className="gap-2"
              >
                <CalendarX className="h-4 w-4" />
                Bloquear Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar de Availability</CardTitle>
            <CardDescription>
              Clique nas datas para marcá-las como {mode === "available" ? "disponíveis" : "bloqueadas"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={handleDateSelect}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              locale={ptBR}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Legenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-green-600"></div>
                <span className="text-sm">Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-red-600"></div>
                <span className="text-sm">Bloqueado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-blue-600"></div>
                <span className="text-sm">Evento Confirmado</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Dates List */}
        {(selectedDates.length > 0 || blockedDates.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedDates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5 text-green-600" />
                    Datas Disponíveis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedDates
                      .sort((a, b) => a.getTime() - b.getTime())
                      .map((date, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded bg-green-50 border border-green-200"
                        >
                          <span className="text-sm font-medium">
                            {format(date, "dd/MM/yyyy (EEEE)", { locale: ptBR })}
                          </span>
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                            Disponível
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {blockedDates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarX className="h-5 w-5 text-red-600" />
                    Datas Bloqueadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {blockedDates
                      .sort((a, b) => a.getTime() - b.getTime())
                      .map((date, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded bg-red-50 border border-red-200"
                        >
                          <span className="text-sm font-medium">
                            {format(date, "dd/MM/yyyy (EEEE)", { locale: ptBR })}
                          </span>
                          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                            Bloqueado
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" className="gap-2">
            <CalendarCheck className="h-4 w-4" />
            Save Availability
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
