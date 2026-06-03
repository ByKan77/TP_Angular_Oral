import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Info } from '../models/info.model';
import { Character } from '../models/character.model';

export interface CharactersGraphqlResult {
  info: Info;
  results: Character[];
}

interface GraphqlLocationRef {
  id: string | null;
  name: string;
}

interface GraphqlCharacterRow {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: GraphqlLocationRef;
  location: GraphqlLocationRef;
}

const API_CHARACTER = 'https://rickandmortyapi.com/api/character';
const API_LOCATION = 'https://rickandmortyapi.com/api/location';

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
        origin {
          id
          name
        }
        location {
          id
          name
        }
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
    const filter: Record<string, string> = {};
    if (name?.trim()) {
      filter['name'] = name.trim();
    }
    if (status) {
      filter['status'] = status;
    }

    const variables: { page: number; filter?: Record<string, string> } = {
      page,
    };
    if (Object.keys(filter).length > 0) {
      variables.filter = filter;
    }

    return this.apollo
      .query<{
        characters: {
          info: Info;
          results: GraphqlCharacterRow[];
        };
      }>({
        query: CHARACTERS_QUERY,
        variables,
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result) => {
          const block = result.data?.characters;
          if (!block) {
            throw new Error('Réponse GraphQL vide');
          }
          return {
            info: block.info,
            results: block.results.map((row) => this.toCharacter(row)),
          };
        }),
        catchError((err: unknown) => {
          const message =
            err instanceof Error ? err.message : 'Erreur GraphQL';
          return throwError(() => new Error(message));
        })
      );
  }

  private toCharacter(row: GraphqlCharacterRow): Character {
    const id = Number(row.id);
    return {
      id,
      name: row.name,
      status: row.status,
      species: row.species,
      type: row.type,
      gender: row.gender,
      image: row.image,
      url: `${API_CHARACTER}/${id}`,
      origin: this.toLocationRef(row.origin),
      location: this.toLocationRef(row.location),
      episode: [],
    };
  }

  private toLocationRef(ref: GraphqlLocationRef): {
    name: string;
    url: string;
  } {
    const url =
      ref.id != null
        ? `${API_LOCATION}/${ref.id}`
        : `${API_LOCATION}/unknown`;
    return { name: ref.name, url };
  }
}
