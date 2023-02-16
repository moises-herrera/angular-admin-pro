import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Collection } from 'src/app/models';

const base_url = environment.base_url;

@Pipe({
  name: 'image',
})
export class ImagePipe implements PipeTransform {
  transform(imageUrl: string, type: Collection): string {
    if (imageUrl?.includes('https')) return imageUrl;

    if (imageUrl) {
      return `${base_url}/upload/${type}/${imageUrl}`;
    }

    return `${base_url}/upload/${type}/no-image`;
  }
}
