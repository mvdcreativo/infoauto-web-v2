import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Product } from '../../products/interfaces/product';
import { Image } from '../../products/interfaces/resultado';

@Injectable({
  providedIn: 'root'
})
export class PublishService {

  public publicationSubject$: BehaviorSubject<Product> = new BehaviorSubject<Product>(null);
  public publication: Observable<Product>;

  public plantillaSubject$: BehaviorSubject<Product> = new BehaviorSubject<Product>(null);
  public plantilla: Observable<Product>;


  constructor(
    private _http: HttpClient,
    private route: Router,
    private activateRoute: ActivatedRoute
  ) {

    this.publication = this.publicationSubject$.asObservable();
    console.log(this.publicationValue);
    
  }


  public get publicationValue(): Product {
    return this.publicationSubject$.value;
  }
  public get plantillaValue(): Product {
    return this.plantillaSubject$.value;
  }

//// Busca plantilla
  findPlantilla(product){
    const dataFind = {
      category_id : product.vehicle_category_id,
      brand_id: product.brand_id,
      model_id: product.vehicle_model_id,
      sub_model_id: product.vehicle_sub_model_id,
      year: product.year,
      cilindrada: product.cilindrada
    }

    return this._http.post<Product>(`${environment.API}search-plantilla`, dataFind).pipe(take(1))

    
     
  }



  ////Recupera Publicación
  getPublicationById(id:number){
    return this._http.get<Product>(`${environment.API}product/${id}`).pipe(
      map(
        res =>{
          this.publicationSubject$.next(res)

          ///busca si existe y actualiza vaores por defecto Plantilla
          
          console.log(res);
          
        },
        error => this.route.navigate(['/vender/step1'])
      )
    )
  }


  ///guarda primera vez publicación y queda como pendiente hasta el último Step
  addPublication(data) {
    return this._http.post<Product>(`${environment.API}product`, data).pipe(
      take(1)
    ).subscribe(
      res => {
        this.publicationSubject$.next(res)
        console.log(res)
        this.route.navigate(['/vender/step2', this.publicationValue.id ])
      },
      error => { console.log(error) }
    )
  }

  ///Actualiza publicación con cada Step que la llama
  updatePublication(data: Product, Step: string) {

    const publicationId = this.publicationValue.id
    const nexStep = `${Step}/${publicationId}`

    return this._http.put<Product>(`${environment.API}product/${publicationId}`, data).pipe(
      take(1)
    ).subscribe(
      res => {
        this.publicationSubject$.next(res)
        console.log(res)
        if(Step === "/mi-cuenta/publicaciones"){
          this.route.navigate([Step])
        }else{
          this.route.navigate([nexStep])
        }
      },
      error => { console.log(error) }
    )
  }


  uploadProductImage(publicationID: number, files: FileList, index?: number) {

    const formData = new FormData();
    console.log(files);

    for (let i = 0; i < files.length; i++) {
      formData.append('images[]', files[i])
      // formData.append("_method", "PUT")
    }

    formData.append("_method", "PUT")

    return this._http.post(`${environment.API}product/${publicationID}`, formData, {
      observe: 'events',
      reportProgress: true
    })
  }

  updateImage(data){
    data.map(
      d => this._http.put(`${environment.API}image/${d.id}`, d).pipe(take(1)).subscribe()
    )
  }

  removeImageId(imageID) {
    return this._http.delete<Image>(`${environment.API}image/${imageID}`)
    .pipe(take(1))
    .subscribe(
      
      res=> {
        console.log(res);
        this.publicationSubject$.next(res.products[0])
      }
    );
  }
  // getPublication(){
  //   return
  // }

  deletePublication(id) {
    return this._http.delete<Product>(`${environment.API}product/${id}`).pipe(
      take(1)
    )
  }


}
