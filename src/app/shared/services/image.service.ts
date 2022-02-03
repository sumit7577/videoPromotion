import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  public convertSvgToBase64PNG(svg: Element): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let data = (new XMLSerializer()).serializeToString(svg);
        let DOMURL = window.URL || window.webkitURL || window;
        let img = new Image();

        let svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
        let url = (DOMURL as any).createObjectURL(svgBlob);
        let svgSize = svg.getBoundingClientRect();
        canvas.width = svgSize.width * 3;
        canvas.height = svgSize.height * 3;

        img.onload = function () {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
          img.remove();
          canvas.remove();
        };

        img.src = url;
      }
      catch (err) {
        reject(err);
      }
    });
  }

  /**Convert an image url, path to bade 64 string. */
  public imgPathToBase64(path: string): Promise<string> {
    return fetch(path)
      .then(resp => {
        return resp.blob();
      })
      .then(blob => {
        return new Promise<string>((resolve, reject) => {
          try {
            var reader = new FileReader();
            reader.onload = () => resolve(reader.result.toString());
            reader.readAsDataURL(blob);
          }
          catch (err) {
            reject(err);
          }
        })
      });
  }
}
