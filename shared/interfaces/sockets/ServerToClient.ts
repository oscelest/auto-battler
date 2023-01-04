import {EncounterDTO} from "../dto/Encounter.dto";
import {GameDTO} from "../dto/Game.dto";

export interface ServerToClient {
  getGameData(game: GameDTO): void;
  getEncounterData(encounter: EncounterDTO): void;
  startEncounter(encounter: EncounterDTO): void;
}
