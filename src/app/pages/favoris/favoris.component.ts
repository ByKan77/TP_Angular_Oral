import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { Character } from '../../models/character.model';
import { FavorisService } from '../../services/favoris.service';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';

@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [CharacterCardComponent],
  templateUrl: './favoris.component.html',
  styleUrl: './favoris.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavorisComponent {
  readonly favorisService = inject(FavorisService);

  onToggle(character: Character): void {
    this.favorisService.toggle(character);
  }
}
