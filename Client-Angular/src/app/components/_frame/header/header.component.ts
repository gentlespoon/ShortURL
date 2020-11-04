import { Component, OnInit } from "@angular/core";
import { SessionService } from "../../../services/session.service";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  public environment = environment;

  constructor(public sessionService: SessionService) {}

  ngOnInit() {}
}
