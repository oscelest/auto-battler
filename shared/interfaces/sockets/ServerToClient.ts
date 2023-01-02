import {EncounterDTO} from "../dto/Encounter.dto";

export interface ServerToClient {
  game_start: (encounter: EncounterDTO) => void;
}
