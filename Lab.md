# Build Microsoft Teams customization using SharePoint Framework

In this lab you will create a SharePoint Framework (SPFx) solution that will work in both SharePoint and Microsoft Teams.

## In this lab

- [Deploy SPFx Solutions to Microsoft Teams](#exercise1)
- [Adding Conditional Logic for SharePoint or Microsoft Teams](#exercise2)
- [Updating Configuration Settings](#exercise3)

## Prerequisites

To complete this lab, you need the following:

- Office 365 tenancy
  > If you do not have one, you obtain one (for free) by signing up to the [Office 365 Developer Program](https://developer.microsoft.com/office/dev-program).
- Local SharePoint Framework development environment installed and configured
  - Refer to the SharePoint Framework documentation, specifically the **[Getting Started > Set up development environment](https://docs.microsoft.com/sharepoint/dev/spfx/set-up-your-development-environment)** for the most current steps

<a name="exercise1"></a>

## Exercise 1: Deploy SPFx Solutions to Microsoft Teams

In this exercise you will create a SharePoint Framework (SPFx) solution that will work in both SharePoint and as a tab in Microsoft Teams.

1. Open a command prompt and change to the folder where you want to create the project.
1. Run the SharePoint Yeoman generator by executing the following command:

    ```shell
    yo @microsoft/sharepoint
    ```

    Use the following to complete the prompt that is displayed:

    - **What is your solution name?**: spfxteams
    - **Which baseline packages do you want to target for your component(s)?**: SharePoint Online only (latest)
    - **Where do you want to place the files?**: Use the current folder
    - **Do you want to allow the tenant admin the choice of being able to deploy the solution to all sites immediately without running any feature deployment or adding apps in sites?**: Yes
    - **Will the components in the solution require permissions to access web APIs that are unique and not shared with other components in the tenant?**: No
    - **Which type of client-side component to create?**: Web Part
    - **What is your Web Part name?**: SPFx Teams Together
    - **What is your Web Part description?**: SPFx Teams Together description
    - **Which framework would you like to use?** No JavaScript framework

    ![Screenshot of the Yeoman SharePoint generator](./Images/createProject-01.png)

    After provisioning the folders required for the project, the generator will install all the dependency packages using NPM.

1. Open the project in an editor such as Visual Studio Code (*aka: VSCode*).

    ![Screenshot of the SPFx Project](./Images/createProject-02.png)

1. Enable the web part to be used in Microsoft Teams:
    1. Locate and open the file **./src/webparts/spFxTeamsTogether/SpFxTeamsTogetherWebPart.manifest.json**:
    1. Within the web part manifest file, locate the property `supportedHosts`:

        ```ts
        "supportedHosts": ["SharePointWebPart"],
        ```

        Add another option to enable this web part to be used as a tab in a Microsoft Teams team:

        ```ts
        "supportedHosts": ["SharePointWebPart", "TeamsTab"],
        ```

### Create and Deploy the Microsoft Teams App Package

1. Notice the project contains a folder **teams** that contains two images. These are used in Microsoft Teams to display the custom tab.

    > You may notice there is no **manifest.json** file present. The manifest file can be generated automatically by SharePoint from the **App Catalog** site. However, at this time, this functionality is not fully operational.
    >
    > Alternatively, you can manually create the manifest file if you want to have more control over the default values SharePoint will create. For more information on this, refer to the documentation: [Create Microsoft Teams manifest manually for a web part and deploy it to Microsoft Teams](https://docs.microsoft.com/sharepoint/dev/spfx/web-parts/guidance/creating-team-manifest-manually-for-webpart).
    >
    > Because the automatic generation & deployment of the Microsoft Teams manifest is not currently operational, you will manually create the Microsoft Teams manifest and package.

1. Manually create the Microsoft Teams manifest and app package:
    1. Copy the **manifest.json** file from [Resources/manifest.json](./Resources/manifest.json) to the **./teams** folder in your project.
    1. Open the **manifest.json** file. This file contains multiple strings that need to be updated to match the SPFx component. Use the following table to determine the values that should be replaced. The SPFx component properties are found in the web part manifest file: **./src/webparts/spFxTeamsTogether/SpFxTeamsTogetherWebPart.manifest.json**

        |          manifest.json string          |  Property in SPFx component manifest  |
        | -------------------------------------- | ------------------------------------- |
        | `{{SPFX_COMPONENT_ALIAS}}`             | `alias`                               |
        | `{{SPFX_COMPONENT_NAME}}`              | `preconfiguredEntries[0].title`       |
        | `{{SPFX_COMPONENT_SHORT_DESCRIPTION}}` | `preconfiguredEntries[0].description` |
        | `{{SPFX_COMPONENT_LONG_DESCRIPTION}}`  | `preconfiguredEntries[0].description` |
        | `{{SPFX_COMPONENT_ID}}`                | `id`                                  |

    > Note: Don't miss replacing `{{SPFX_COMPONENT_ID}}` in `configurableTabs[0].configurationUrl`. You will likely have to scroll your editor to the right to see it.

    > Note: The tokens surrounded by single curly braces (e.g. `{teamSiteDomain}`) do not need to be replaced.

    1. Create a Microsoft Teams app package by zipping the contents of the **./teams** folder. Make sure to zip just the contents and not the folder itself. This ZIP archive should contain 3 files at the root: two images & the **manifest.json**.

### Create and Deploy the SharePoint Package

1. In order to test the web part in SharePoint and Microsoft Teams, it must first be deployed to an app catalog.
    1. Open a browser and navigate to your SharePoint Online Tenant-Scoped App Catalog site.
    1. Select the menu item **Apps for SharePoint** from the left-hand navigation menu.
    1. Build the project by opening a command prompt and changing to the root folder of the project. Then execute the following command:

        ```shell
        gulp build
        ```

    1. Next, create a production bundle of the project by running the following command on the command line from the root of the project:

        ```shell
        gulp bundle --ship
        ```

    1. Finally, create a deployment package of the project by running the following command on the command line from the root of the project:

        ```shell
        gulp package-solution --ship
        ```

    1. Locate the file created by the gulp task, found in the **./sharepoint/solution** folder with the name ***.sppkg**.
    1. Drag this file into the **Apps for SharePoint** library in the browser:

        ![Screenshot dragging the SharePoint package into the Apps for SharePoint library](./Images/createProject-03.png)

    1. In the **Do you trust...?** dialog, select the checkbox **Make this solution available to all sites in the organization** and then select **Deploy**.

        ![Screenshot of the app deployment trust dialog](./Images/createProject-04.png)

        This will make this SPFx web part available to all site collections in the tenant, including those that are behind a Microsoft Teams team.

### Test the Web Part in SharePoint & Microsoft Teams

1. Test the SPFx web part in SharePoint:
    1. In the browser, navigate to a modern SharePoint page.
    1. Select the **Edit** button in the top-right of the page.
    1. Select the (+) icon to open the SharePoint web part toolbox and locate the web part **SPFx Teams Together**:

        ![Screenshot of the SharePoint Web Part](./Images/addWebPart-01.png)

    1. The SharePoint Framework web part will be displayed on the page as shown in the following figure:

        ![Screenshot of the SharePoint Web Part](./Images/addWebPart-02.png)

1. Test the SPFx web part in Microsoft Teams:
    1. First, create a new Microsoft Teams team.

        Using the same browser where you are logged into SharePoint Online, navigate to https://teams.microsoft.com. When prompted, load the web client.

        1. If you do not have any teams in your tenant, you will be presented with the following dialog. Otherwise, select the **Join or create a team** at the bottom of the list of teams:

            ![Screenshot of the create teams dialog](./Images/createTeam-01.png)

        1. On the **Create your team** dialog, select **Build a team from scratch**:

            ![Screenshot of the create teams dialog](./Images/createTeam-02.png)

        1. On the **What kind of team will this be?** dialog, select **Public**:

            ![Screenshot of the create teams dialog](./Images/createTeam-03.png)

        1. When prompted, use the name **My First Team**.

    1. Install the Microsoft Teams application as a new tab that will expose the SharePoint Framework web part in Microsoft Teams:
        1. Select the **My First Team** team previously created.
        1. Select the **General** channel.

            ![Screenshot selecting the General channel in the My First Team team](./Images/addTab-01.png)

        1. Add a custom tab to the team using the SPFx web part:
            1. At the top of the page, select the + icon in the horizontal navigation:

                ![Screenshot of the Microsoft Teams teams navigation](./Images/addTab-02.png)

            1. In the **Add a tab** dialog, select **More Apps**

                ![Screenshot of the Add a tab dialog](./Images/addTab-10.png)

            1. Select the **Upload a custom app** > **Upload for ...** from the list of app categories:

                ![Screenshot of the Microsoft Teams teams navigation](./Images/addTab-03.png)

            1. Select the Microsoft Teams application ZIP file previously created. This is the file that contains the **manifest.json** and two image files.

                After a moment, the application will appear next to your tenant name.

                > You may need to refresh the page for the app to appear if you are using the browser Microsoft Teams client.

            1. Select the **SPFx Teams Together** app.

                ![Screenshot SPFx Teams Together app](./Images/addTab-04.png)

            1. In the **SPFx Teams Together** dialog, select the **My First Team** in the **Add to a team** dropdown control and select **Install**.

                ![Screenshot installing the SPFx Teams Together app](./Images/addTab-05.png)

            1. In the **SPFx Teams Together is now available for My First Team** dialog, select the **General** channel and select **Set up**.

                ![Screenshot setting up the SPFx Teams Together app](./Images/addTab-06.png)

            1. The next dialog will confirm the installation of the app. Select **Save**.

                ![Screenshot confirming installation of the SPFx Teams Together app](./Images/addTab-07.png)

            1. The application should now load in Microsoft Teams within the **General** channel under the tab **SPFx Teams Together**.

                ![Screenshot setting up the SPFx Teams Together app](./Images/addTab-08.png)

            1. Select the **X** in the upper-right corner of the property pane to close the initial configuration.

<a name="exercise2"></a>

## Exercise 2: Adding Conditional Logic for SharePoint or Microsoft Teams

In this exercise, you will update the SharePoint Framework web part to display different information on the page depending if it is running within a SharePoint of Microsoft Teams context.

> This exercise assumes you completed the previous exercise. The final result from the previous exercise is used as the starting point for this exercise. The final results from the previous exercise can be found here: [./Demos/01-spfxteams](./Demos/01-spfxteams).

1. Locate and open the file **./src/webparts/spFxTeamsTogether/SpFxTeamsTogetherWebPart.ts**.
1. Add the following `import` statement to the existing `import` statements at the top of the file:

    ```ts
    import * as microsoftTeams from '@microsoft/teams-js';
    ```

1. Add the following private member to the class `SpFxTeamsTogetherWebPart`. This will store the Microsoft Teams context in the case when the web part is running within a Microsoft Teams team:

    ```ts
    private teamsContext: microsoftTeams.Context;
    ```

1. Add the following method to the `SpFxTeamsTogetherWebPart` class to run when the web part is loaded on a page:

    ```ts
    protected onInit(): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        if (this.context.microsoftTeams) {
          this.context.microsoftTeams.getContext(context => {
            this.teamsContext = context;
            resolve();
          });
        } else {
          resolve();
        }
      });
    }
    ```

1. Locate the `render()` method in the `SpFxTeamsTogetherWebPart` class. Add the following two members to set the title and current location depending if the web part is running in a SharePoint or Microsoft Teams context. Notice how using the necessary context property, you can get the name of the team or SharePoint site the web part is currently running within:

    ```ts
    let title: string = (this.teamsContext) 
      ? 'Teams'
      : 'SharePoint';
    let currentLocation: string = (this.teamsContext) 
      ? `Team: ${this.teamsContext.teamName}`
      : `site collection ${this.context.pageContext.web.title}`;
    ```

1. Lastly, update the HTML written to the page. Replace the existing `<div class="${ styles.column }">` with the following markup:

    > The only two parts that have changed are the title & subtitle.

    ```tsx
    <div class="${ styles.column }">
      <span class="${ styles.title }">Welcome to ${ title }!</span>
      <p class="${ styles.subTitle }">Currently in the context of the following ${ currentLocation }</p>
      <p class="${ styles.description }">${escape(this.properties.description)}</p>
      <a href="https://aka.ms/spfx" class="${ styles.button }">
        <span class="${ styles.label }">Learn more</span>
      </a>
    </div>
    ```

1. Rebuild, bundle, package and deploy the web part to see the results:
    1. Build the project by opening a command prompt and changing to the root folder of the project. Then execute the following command:

        ```shell
        gulp build
        ```

    1. Next, create a production bundle of the project by running the following command on the command line from the root of the project:

        ```shell
        gulp bundle --ship
        ```

    1. Finally, create a deployment package of the project by running the following command on the command line from the root of the project:

        ```shell
        gulp package-solution --ship
        ```

    1. Locate the file created by the gulp task, found in the **./sharepoint/solution** folder with the name ***.sppkg**.
    1. Drag this file into the **Apps for SharePoint** library in the browser. When prompted, select **Replace It**.

        ![Screenshot dragging the SharePoint package into the Apps for SharePoint library](./Images/updateSolution-01.png)

1. Test the changes.
    1. Navigate back to the SharePoint page where you added the web part in the previous exercise.
    1. Notice how the page shows it is currently in the SharePoint context and displays the current SharePoint site name:

        ![Screenshot of the SPFx solution in SharePoint](./Images/differentContexts-01.png)

    1. Now go back into the Microsoft Teams team and select the tab that you previously added. Notice how the message says you are currently in Teams and the name of the team:

        ![Screenshot of the SPFx solution in Microsoft Teams](./Images/differentContexts-02.png)

<a name="exercise3"></a>

## Exercise 3: Updating Configuration Settings

In this exercise, you will update the configuration settings for the SharePoint Framework application, as well as update the configuration details of the Microsoft Teams application.

> This exercise assumes you completed the previous exercise. The final result from the previous exercise is used as the starting point for this exercise. The final results from the previous exercise can be found here: [./Demos/02-spfxteams](./Demos/02-spfxteams).

1. Add a new custom property to the web part:
    1. Locate and open the file **./src/webparts/spFxTeamsTogether/SpFxTeamsTogetherWebPart.ts**.
    1. Locate the interface `ISpFxTeamsTogetherWebPartProps`.
    1. Add a new property to the interface:

        ```ts
        customSetting: string;
        ```

    1. Locate the `render()` method within the `SpFxTeamsTogetherWebPart` class.
    1. Locate the following line in the `render()` method:

        ```tsx
        <p class="${ styles.description }">${escape(this.properties.description)}</p>
        ```

    1. Add the following TSX markup immediately following the previous line:

        ```tsx
        <p class="${ styles.description }">${escape(this.properties.customSetting)}</p>
        ```

    1. Scroll down to the `getPropertyPaneConfiguration()` method in the `SpFxTeamsTogetherWebPart` class.
    1. Locate the property pane field control for the existing **description** property:

        ```ts
        PropertyPaneTextField('description', {
          label: strings.DescriptionFieldLabel
        }),
        ```

    1. Add a comma after the existing `PropertyPaneTextField()` and the following code to give users a way to edit the setting:

        ```ts
        PropertyPaneTextField('customSetting', {
          label: 'Custom Setting'
        })
        ```

1. Add a default value for the new property:
    1. Locate and open the file **./src/webparts/spFxTeamsTogether/SpFxTeamsTogetherWebPart.manifest.json**
    1. Locate the `preconfiguredEntries[0].properties` object.
    1. Add the following property and value to the `properties` object:

        ```json
        "customSetting": "Default custom setting"
        ```

1. Rebuild, bundle, package and deploy the web part to see the results:
    1. Build the project by opening a command prompt and changing to the root folder of the project. Then execute the following command:

        ```shell
        gulp build
        ```

    1. Next, create a production bundle of the project by running the following command on the command line from the root of the project:

        ```shell
        gulp bundle --ship
        ```

    1. Finally, create a deployment package of the project by running the following command on the command line from the root of the project:

        ```shell
        gulp package-solution --ship
        ```

    1. Locate the file created by the gulp task, found in the **./sharepoint/solution** folder with the name ***.sppkg**.
    1. Drag this file into the **Apps for SharePoint** library in the browser. When prompted, select **Replace It**.

        ![Screenshot dragging the SharePoint package into the Apps for SharePoint library](./Images/updateSolution-01.png)

1. Test the changes.
    1. Navigate back to the SharePoint page where you added the web part in the previous exercise and refresh the page.
    1. Edit the page and add a value to the new custom property you added. Notice how the page shows the value of the configuration setting:

        ![Screenshot of the SPFx solution in SharePoint](./Images/updateSettings-01.png)

    1. Now go back into the Microsoft Teams team. Refresh the page if you have Teams open in a web browser. Select the down arrow to the right of the **SPFx Teams Together** tab and select **Settings**.

        ![Screenshot of the SPFx solution in Microsoft Teams](./Images/updateSettings-02.png)

    1. Add a value to the **Custom Setting** property in the property pane. Notice how the tab shows the value of the configuration setting:

        ![Screenshot of the SPFx solution in Microsoft Teams](./Images/updateSettings-03.png)

1. Update the Microsoft Teams application to disallow editing the configuration settings after the tab has been installed.
    1. Locate and open the following file in the project: **teams/manifest.json**.
    1. Set the value of the the property `version` to `0.2`.
    1. Locate the property `configurableTabs[0].canUpdateConfiguration`.
    1. Set the value of this property to `false` and save the file.
1. Recreate the Microsoft Teams app package by ZIP'ing the three files, **manifest.json** & two image files, into a new Microsoft Teams app package.
1. Delete the previous Microsoft Teams tab:
    1. Within the Microsoft Teams client, go to the **General** tab within the **My First Team**.
    1. Select the down-arrow to the right of the **SPFx Teams Together** tab and select **Remove**.
    1. When prompted, select **Remove**.
1. Update the previously installed Microsoft Teams app:
    1. Within the Microsoft Teams client, select **Store** in the lower right corner, and then select your tenant from the sidebar menu.
    1. Select the app menu, then select **Update**.

        ![Screenshot of the SPFx solution in Microsoft Teams](./Images/updateSettings-04.png)

    1. Select the new Microsoft Teams app manifest.
1. Test the new Microsoft Teams app:
    1. Select the **My First Team** team previously created.
    1. Select the **General** channel.

        ![Screenshot selecting the General channel in the My First Team team](./Images/addTab-01.png)

    1. Add a custom tab to the team using the SPFx web part:
        1. At the top of the page, select the + icon in the horizontal navigation:

            ![Screenshot of the Microsoft Teams teams navigation](./Images/addTab-02.png)

        1. In the **Add a tab** dialog, locate and select the **SPFx Teams Together** app:

            ![Screenshot of the SPFx Teams Together app](./Images/addTab-09.png)

        1. The next dialog will confirm the installation of the app. Select **Save**.

            ![Screenshot confirming installation of the SPFx Teams Together app](./Images/addTab-07.png)

        1. The application should now load in Microsoft Teams within the **General** channel under the tab **SPFx Teams Together**.

            ![Screenshot setting up the SPFx Teams Together app](./Images/addTab-08.png)

        1. Notice how the web part's property pane opens by default. Edit the values of the public properties on the web part and then select the **X** in the upper-right corner of the property pane to close the initial configuration:

            ![Screenshot of the default settings on the web part](./Images/updateSettings-05.png)

    1. Now go back into the Microsoft Teams team. Select the down arrow to the right of the **SPFx Teams Together** tab. Notice the **Settings** option is no longer present. This is because the setting in the Microsoft Teams app manifest specified the configuration can not be updated once it is installed into Microsoft Teams.

        ![Screenshot of the SPFx solution in Microsoft Teams](./Images/updateSettings-06.png)
