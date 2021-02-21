import '@babel/polyfill';
import { Version } from '@microsoft/sp-core-library';
import { SPPermission } from '@microsoft/sp-page-context';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-webpart-base';
import '@pnp/polyfill-ie11';
import { sp } from '@pnp/sp/presets/all';
//import 'ie11-custom-properties';
import 'antd/dist/antd.css';
import * as strings from 'RcrCalendarWebPartStrings';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IRcrCalendarProps } from './components/IRcrCalendarProps';
import RcrCalendar from './components/RcrCalendar';
import Service from './services/Service';


export interface IRcrCalendarWebPartProps {
  title: string;
  description: string;
  urlApi: string;
}

export default class RcrCalendarWebPart extends BaseClientSideWebPart<IRcrCalendarWebPartProps> {

  public render(): void {
    Service.urlApi = this.properties.urlApi;
    this.initUser();
    const element: React.ReactElement<IRcrCalendarProps> = React.createElement(
      RcrCalendar,
      {
        title: this.properties.title,
        description: this.properties.description,
        urlApi: this.properties.urlApi
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private initUser() {
    console.log('this context ', this.context.pageContext.user, this.context.pageContext, this.context);
    if (this.context && this.context.pageContext && this.context.pageContext.user) {
      Service.userName = this.context.pageContext.user.loginName;
      Service.userId = this.context.pageContext.legacyPageContext.systemUserKey;
    }
    const permissions = this.context.pageContext.web.permissions;
    Service.isEdit = permissions.hasPermission(SPPermission.editListItems);
    Service.isRead = permissions.hasPermission(SPPermission.viewListItems);
    console.log('full control ', permissions.hasPermission(SPPermission.fullMask));
    console.log('manage ', permissions.hasPermission(SPPermission.manageWeb));
    sp.setup({
      spfxContext: this.context
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('urlApi', {
                  label: strings.DescriptionUrlApi
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
