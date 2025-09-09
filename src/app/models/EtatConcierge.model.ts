import { Demande } from './Demande.model';
import { TypeDemande } from './TypeDemande.model';

export interface EtatConcierge {
  id: number;
  demande: Demande;
  nomEmploye: string;
  prenomEmploye: string;
  matriculeEmploye: string;
  typeDemande: TypeDemande;
  workflowId: string;
  dateGeneration: string;  // ISO string

  
  dateSortie?: string;
  heureSortie?: string;
  dateRetour?: string;
  heureRetour?: string;
  dureeHeures?: number;
}