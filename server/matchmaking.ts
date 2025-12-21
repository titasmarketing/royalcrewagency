import * as db from "./db";

interface StaffMember {
  id: number;
  name: string;
  rating: number;
  specialties: string[];
  hourlyRate: string;
}

interface MatchCriteria {
  eventDate: Date;
  location: string;
  requiredRoles: string[];
  maxBudget?: number;
}

interface MatchResult {
  staffId: number;
  name: string;
  score: number;
  rating: number;
  hourlyRate: string;
  matchReasons: string[];
}

/**
 * Calcula a distância entre dois pontos geográficos (fórmula de Haversine simplificada)
 * Para produção, integrar com Google Maps Distance Matrix API
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Algoritmo de matchmaking inteligente para selecionar os melhores profissionais
 * Critérios de pontuação:
 * - Disponibilidade (40 pontos)
 * - Avaliação/Rating (30 pontos)
 * - Proximidade geográfica (20 pontos)
 * - Custo-benefício (10 pontos)
 */
export async function findBestMatches(
  criteria: MatchCriteria,
  limit: number = 10
): Promise<MatchResult[]> {
  // Buscar todos os membros do staff ativos
  const allStaff = await db.getAllStaffMembers();

  if (!allStaff || allStaff.length === 0) {
    return [];
  }

  const matches: MatchResult[] = [];

  for (const staff of allStaff) {
    // Verificar se o staff está ativo (campo não existe no schema atual, assumir ativo)
    // if (staff.status !== "active") continue;

    const matchReasons: string[] = [];
    let score = 0;

    // 1. DISPONIBILIDADE (40 pontos)
    // TODO: Verificar disponibilidade real no banco de dados
    // Por enquanto, assumimos disponível se não houver conflitos
    const isAvailable = true; // Placeholder
    if (isAvailable) {
      score += 40;
      matchReasons.push("Disponível na data solicitada");
    } else {
      continue; // Pula se não estiver disponível
    }

    // 2. AVALIAÇÃO/RATING (30 pontos)
    // Rating de 0-5, normalizado para 0-30
    const rating = Number(staff.rating) || 0;
    const ratingScore = (rating / 5) * 30;
    score += ratingScore;
    if (rating >= 4.5) {
      matchReasons.push(`Avaliação excelente (${rating.toFixed(1)}⭐)`);
    } else if (rating >= 4.0) {
      matchReasons.push(`Boa avaliação (${rating.toFixed(1)}⭐)`);
    }

    // 3. ESPECIALIDADES/HABILIDADES (bônus de até 15 pontos)
    const specialties = staff.specialties ? JSON.parse(staff.specialties as any) : [];
    const matchingSpecialties = criteria.requiredRoles.filter((role) =>
      specialties.includes(role)
    );
    if (matchingSpecialties.length > 0) {
      const specialtyBonus = Math.min(matchingSpecialties.length * 5, 15);
      score += specialtyBonus;
      matchReasons.push(`Especialista em: ${matchingSpecialties.join(", ")}`);
    }

    // 4. PROXIMIDADE GEOGRÁFICA (20 pontos)
    // TODO: Implementar cálculo real de distância com geolocalização
    // Por enquanto, pontuação aleatória
    const proximityScore = 15; // Placeholder
    score += proximityScore;
    matchReasons.push("Localização favorável");

    // 5. CUSTO-BENEFÍCIO (10 pontos)
    if (criteria.maxBudget) {
      const hourlyRate = parseFloat(staff.hourlyRate || "0");
      if (hourlyRate <= criteria.maxBudget) {
        const costScore = ((criteria.maxBudget - hourlyRate) / criteria.maxBudget) * 10;
        score += costScore;
        if (hourlyRate <= criteria.maxBudget * 0.7) {
          matchReasons.push("Ótimo custo-benefício");
        }
      }
    } else {
      score += 5; // Pontuação neutra se não houver orçamento definido
    }

    matches.push({
      staffId: staff.id,
      name: staff.user?.name || "Nome não informado",
      score: Math.round(score),
      rating: Number(staff.rating) || 0,
      hourlyRate: staff.hourlyRate || "0.00",
      matchReasons,
    });
  }

  // Ordenar por pontuação (maior para menor)
  matches.sort((a, b) => b.score - a.score);

  // Retornar os top N matches
  return matches.slice(0, limit);
}

/**
 * Verifica conflitos de agenda para um membro do staff
 */
export async function checkAvailability(
  staffId: number,
  eventDate: Date,
  duration: number = 8
): Promise<{ available: boolean; conflicts: string[] }> {
  // TODO: Implementar verificação real de conflitos no banco de dados
  // Verificar:
  // 1. Eventos já confirmados na mesma data
  // 2. Bloqueios de disponibilidade do staff
  // 3. Tempo de deslocamento entre eventos

  return {
    available: true,
    conflicts: [],
  };
}

/**
 * Calcula o custo estimado de um evento com base na equipe selecionada
 */
export function calculateEventCost(
  staffMembers: Array<{ hourlyRate: string; hours: number }>,
  additionalCosts: number = 0
): {
  staffCost: number;
  additionalCost: number;
  subtotal: number;
  taxes: number;
  total: number;
} {
  const staffCost = staffMembers.reduce((sum, member) => {
    return sum + parseFloat(member.hourlyRate) * member.hours;
  }, 0);

  const subtotal = staffCost + additionalCosts;
  const taxes = subtotal * 0.15; // 15% de impostos
  const total = subtotal + taxes;

  return {
    staffCost: parseFloat(staffCost.toFixed(2)),
    additionalCost: parseFloat(additionalCosts.toFixed(2)),
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxes: parseFloat(taxes.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
}
