import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';

import { JobDemandeService } from 'src/app/Services/job-demande.service';
import { CVService } from 'src/app/Services/cv.service';

@Component({
  selector: 'app-cv-list',
  templateUrl: './cv-list.component.html',
  styleUrls: ['./cv-list.component.scss']
})
export class CvListComponent implements OnInit {

  cvList=[];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ['id', 'firstName','lastName','email','actions'];
  dataSource ;
  constructor(
     private jobDemandeService:JobDemandeService,
     private cvService:CVService
  ) { }

  ngOnInit() {
    this.loadMyCVs();
  }

  loadMyCVs(){
    this.loadJobDemandes();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  reloadDataSource(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadJobDemandes(){
    this.cvList=[];
      this.jobDemandeService.getMyJobDemandes()
         .subscribe(jobDemandes=>{
              this.cvList=jobDemandes.map(jb=>jb.cv);
              this.reloadDataSource( this.cvList);
         })
   }

   downloadCV(id){
     //exportation pdf  de cv
     this.cvService.downloadCV(id)
        .subscribe(cv=>{
          //our cv is downloaded!
        })
   }
}
