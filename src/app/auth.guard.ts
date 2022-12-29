import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //console.log(route,state);
    let role = this.authService.getRole()
    //console.log(role)
    return true;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //console.log(childRoute,state)
    let role = this.authService.getRole()
    //console.log(role)
    var readOnly =  /^\/?readOnly=true$/;
    // console.error('isReadOnly',readOnly.test(state.url))
    if(readOnly.test(state.url)){
      return true;
    }
    else if(!role){
      this.router.navigateByUrl('/login');
      return false;    
    }
    else if(role=='super-admin'){
      return true
    }
    else{
      var clientBase = /^\/clients$/
      var clientView = /^\/clients\/view\//

      var userInfo = this.authService.getUserInfo();
      if(clientBase.test(state.url) || clientView.test(state.url)){
        let clientId = userInfo['clientId'];
        this.router.navigate(['clients',clientId]);
        return false;
      }
      else{
        return true;
      }      
    }
  }
  constructor(private authService: AuthService, private router: Router){}
}
