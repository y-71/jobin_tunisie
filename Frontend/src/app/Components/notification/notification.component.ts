import { Component, OnInit, SimpleChanges } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EnterpriseService } from 'src/app/Services/enterprise.service';
import { JobDemandeService } from 'src/app/Services/job-demande.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private notificationService:NotificationService,
              private router:Router,
              private route:ActivatedRoute,
              private enterpriseService:EnterpriseService,
              private jobDemandeService:JobDemandeService,
              private authService:AuthService) { 
                
               }
  loggedUser;
  myNotification=null;
  notifications:any[]=[];
  senders=[];
  
  ngOnInit() {
      this.loadLoggedUser();
  }

  loadLoggedUser() {
    this.loggedUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.loggedUser);
    if (this.loggedUser) {
      this.listenToNotification();
      this.loadNotifications(this.loggedUser.id);
    }
  }
   //get current user's notifications
   loadNotifications(userId){
    this.notificationService.getNotifications(userId)
       .subscribe(notifications=>{
         console.log("hello notification")
         console.log(notifications);
          this.notifications=notifications;
          this.loadSenders(notifications);
       })
}
loadSenders(notifications) {
  this.senders=[];
   this.notifications.map(notif=>this.getSender(notif.senderID));
}

getSender(id){
   this.authService.getUser(id)
      .subscribe(user=>{
         this.senders.push(user);
      })
}
 listenToNotification(){
   console.log("listeneing");
     this.notificationService.eventCallback$
        .subscribe(notif=>{
          console.log("eated");
          console.log(notif);
            this.myNotification=notif;
            this.getNotificationDetails(notif);
        })
 }

 getNotificationDetails(notification){
   console.log("notification changed");
   this.myNotification=notification;
 }
  
 Confirm(){
  var id=this.myNotification.jobDemandeID;
   this.jobDemandeService.confirmJobDemande(id)
     .subscribe(jb=>{
       this.myNotification.jobDemandeID=jb.id;       
         console.log("jobDemande confirmed");
     })
}


}
