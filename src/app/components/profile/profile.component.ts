import {Component, OnInit} from '@angular/core';
import {AuthService, SocialUser} from 'angularx-social-login';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ResponseModel, UserService} from '../../services/user.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})


export class ProfileComponent implements OnInit {


  myUser: any;

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.authService.authState
      .pipe(
        map((user: SocialUser) => {
          return {
            ...user,
            email: 'test@test.com'
          };
        })
      ).subscribe((user: SocialUser) => {
      if (user != null) {
        this.myUser = user;
      } else {
        return;
      }
    });

    this.userService.userData$
      .pipe(
        map((user: SocialUser) => {
          if (user instanceof SocialUser) {
            return {
              ...user,
              email: 'test@test.com'
            };
          } else {
            return user;
          }
        })
      )
      .subscribe((data: ResponseModel | SocialUser) => {
        this.myUser = data;
      });
  }

  logout() {
    this.userService.logout();
  }
}
