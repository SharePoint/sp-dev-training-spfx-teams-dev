// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './SpFxTeamsTogetherWebPart.module.scss';
import * as strings from 'SpFxTeamsTogetherWebPartStrings';

import * as microsoftTeams from '@microsoft/teams-js';

export interface ISpFxTeamsTogetherWebPartProps {
  description: string;
  customSetting: string;
}

export default class SpFxTeamsTogetherWebPart extends BaseClientSideWebPart<ISpFxTeamsTogetherWebPartProps> {
  private teamsContext: microsoftTeams.Context;

  protected onInit(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.context.sdks.microsoftTeams) {
        this.teamsContext = this.context.sdks.microsoftTeams.context;
      }
      resolve();
    });
  }

  public render(): void {
    let title: string = (this.teamsContext)
      ? 'Teams'
      : 'SharePoint';
    let currentLocation: string = (this.teamsContext)
      ? `Team: ${this.teamsContext.teamName}`
      : `site collection ${this.context.pageContext.web.title}`;

    this.domElement.innerHTML = `
      <div class="${styles.spFxTeamsTogether}">
        <div class="${styles.container}">
          <div class="${styles.row}">
            <div class="${ styles.column }">
              <span class="${ styles.title }">Welcome to ${ title }!</span>
              <p class="${ styles.subTitle }">Currently in the context of the following ${ currentLocation }</p>
              <p class="${ styles.description }">${escape(this.properties.description)}</p>
              <p class="${ styles.description }">${escape(this.properties.customSetting)}</p>
              <a href="https://aka.ms/spfx" class="${ styles.button }">
                <span class="${ styles.label }">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('customSetting', {
                  label: 'Custom Setting'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
