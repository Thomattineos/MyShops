import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class MyMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Éléments par page';
  override nextPageLabel = 'Page suivante';
  override previousPageLabel = 'Page précédente';
  override firstPageLabel = 'Première page';
  override  lastPageLabel = 'Dernière page';

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 sur ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    if (startIndex >= length) {
      return `0 sur ${length}`;
    }

    const endIndex = Math.min(startIndex + pageSize, length);

    return `${startIndex + 1} - ${endIndex} sur ${length}`;
  };
}
