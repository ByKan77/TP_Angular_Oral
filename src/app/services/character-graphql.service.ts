import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, filter, map } from 'rxjs';
import { Info } from '../models/info.model';
import { Character } from '../models/character.model';

export interface CharactersGraphqlResult {
  info: Info;
  results: Character[];
}

const CHARACTERS_QUERY = gql`
  query Characters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        type
        gender
        image
        url
        origin {
          name
          url
        }
        location {
          name
          url
        }
        episode
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class CharacterGraphqlService {
  private readonly apollo = inject(Apollo);

  getAll(
    page: number,
    name?: string,
    status?: string
  ): Observable<CharactersGraphqlResult> {
    const filterInput: Record<string, string> = {};
    if (name?.trim()) {
      filterInput['name'] = name.trim();
    }
    if (status) {
      filterInput['status'] = status;
    }

    return this.apollo
      .watchQuery<{
        characters: CharactersGraphqlResult;
      }>({
        query: CHARACTERS_QUERY,
        variables: {
          page,
          filter: Object.keys(filterInput).length ? filterInput : undefined,
        },
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((result) => result.data?.characters),
        filter((characters): characters is CharactersGraphqlResult => !!characters),
      );
  }
}
