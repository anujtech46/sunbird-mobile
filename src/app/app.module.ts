import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, Events } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ContainerService } from '../core/container/container.services';
import { PluginService } from './plugins.service';
import { TelemetryService } from '../core/services/telemetry/telemetry.service';
import { CoreModule, TabsPage } from "../core";
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { OnboardingPage } from '../plugins/onboarding/onboarding';
import { EventService } from '../core/services/event/event.service';
import { IonicStorageModule } from "@ionic/storage";
import { HTTP } from "@ionic-native/http";

const pluginModules = PluginService.getAllPluginModules();

@NgModule({
  declarations: [
    MyApp,
    TabsPage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    CoreModule,
    IonicStorageModule.forRoot({
      name: "org.sunbird.framework.storage"
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    ...pluginModules
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OnboardingPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PluginService,
    HTTP,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {

  constructor(translate: TranslateService, private eventService: EventService, private events: Events) {
    translate.setDefaultLang('en');

    this.registerForEvent();
  }


  registerForEvent() {
    this.eventService.register((response) => {
      console.log("Event : " + response);
      this.events.publish('genie.event', response);
    }, (error) => {
      console.log("Event : " + error);
    });
  }
}


export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
