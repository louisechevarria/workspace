/** main function */

function onHomepage(e) {

  var resultString = e.formInput;
  var myresult = " "; 

  
  if(resultString != null && resultString != undefined) 
  {
    if(resultString.queryString != null && resultString.queryString != undefined) 
    {
      myresult = resultString.queryString;
    }
  }   

  const builder = CardService.newCardBuilder();

  const topImage = CardService.newImage()
      .setImageUrl('https://i.pinimg.com/736x/9b/85/15/9b85157a25924e66c03f1edba30ea029.jpg');
  
  const topText = CardService.newDecoratedText()
      .setText("From wellness and time-saving services, to serving our community and everything in between, we\'ve been proudly serving you since \'36\'")
      .setWrapText(true);

  const textInput = CardService.newTextInput().setTitle('Search')
      .setFieldName('queryString')

  const submitAction = CardService.newAction()
      .setFunctionName('onHomepage')
      .setLoadIndicator(CardService.LoadIndicator.SPINNER);   

  const searchButton = CardService.newTextButton()
      .setText('Search')
      .setOnClickAction(submitAction)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);  

  const searchSection = CardService.newCardSection()
      .addWidget(topImage)
      .addWidget(topText)
      .addWidget(CardService.newDecoratedText().setText('\n'))
      .addWidget(textInput)
      .addWidget(searchButton)
      .addWidget(CardService.newDecoratedText().setText('\n'));

  searchSection.addWidget(CardService.newDivider());

  for (var x = 0; x < basketItems.length; x++) {

    var itemID = String(x);

    if (basketItems[x].topLabel.match(myresult) || basketItems[x].titleText.match(myresult) || basketItems[x].bottomLabel.match(myresult) || basketItems[x].detailText.match(myresult)) {  

      searchSection.addWidget(CardService.newDecoratedText()
          .setTopLabel(basketItems[x].topLabel)
          .setText(basketItems[x].titleText + "\n" + basketItems[x].detailText)
          .setWrapText(true)
          .setBottomLabel(basketItems[x].bottomLabel)
          .setStartIcon(CardService.newIconImage().setIconUrl(basketItems[x].startIcon))
          .setOnClickAction(CardService.newAction()
              .setFunctionName('editItem')
              //.setParameters({"itemID" : itemID, "topLabel" : basketItems[x].topLabel, "titleText" : basketItems[x].titleText, "detailText" : basketItems[x].detailText, "bottomLabel" : basketItems[x].bottomLabel, "startIcon" : basketItems[x].startIcon})
              .setParameters({"itemID" : itemID})
              .setLoadIndicator(CardService.LoadIndicator.SPINNER)
              )
          .setEndIcon(CardService.newIconImage()
              .setIcon(CardService.Icon.DESCRIPTION)
              )
          );

      searchSection.addWidget(CardService.newDivider());

    }
  }

  builder.addSection(searchSection);

  return builder.build();
}

/** edit item */
function editItem(e) {

  var itemID = e.parameters.itemID;
  
  /** 
  var myItem = {};
  myItem.itemID = e.parameters.itemID;
  myItem.topLabel = e.parameters.topLabel;
  myItem.titleText = e.parameters.titleText;
  myItem.bottomLabel = e.parameters.bottomLabel;
  myItem.startIcon = e.parameters.startIcon;
  myItem.detailText = e.parameters.detailText;
  */

  const builder = CardService.newCardBuilder();

  const topImage = CardService.newImage()
      .setImageUrl(basketItems[itemID].startIcon);

  const topLabelInput = CardService.newTextInput().setTitle('Category')
    .setFieldName('topLabel')
    .setValue(basketItems[itemID].topLabel);

  const titleTextInput = CardService.newTextInput().setTitle('Name')
    .setFieldName('titleText')
    //.setValue(myItem.itemID + " " + myItem.titleText);
    .setValue(basketItems[itemID].titleText);
  
  const detailTextInput = CardService.newTextInput().setTitle('Detail')
    .setFieldName('detailText')
    .setValue(basketItems[itemID].detailText);    

  const bottomLabelInput = CardService.newTextInput().setTitle('Price')
    .setFieldName('bottomLabel')
    .setValue(basketItems[itemID].bottomLabel);        
  
  const startIconInput = CardService.newTextInput().setTitle('Image')
      .setFieldName('startIcon')
      .setValue(basketItems[itemID].startIcon);

  const submitAction = CardService.newAction()
      .setFunctionName('updateItem')
      .setParameters({"itemID" : itemID})
      .setLoadIndicator(CardService.LoadIndicator.SPINNER);   

  const searchButton = CardService.newTextButton()
      .setText('Update')
      .setOnClickAction(submitAction)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);   
  
  const generateTextAction = CardService.newAction()
    .setFunctionName('myGeneratedText')
    .setParameters({"itemID" : itemID})
    //.setParameters({"topLabel" : myItem.topLabel, "titleText" : myItem.titleText, "bottomLabel" : myItem.bottomLabel, "startIcon" : myItem.startIcon})
    .setLoadIndicator(CardService.LoadIndicator.SPINNER); 

  const generateTextButton = CardService.newTextButton()
    .setText('Insert To Email')
    .setOnClickAction(generateTextAction);  

  const postToSpaceAction = CardService.newAction()
    .setFunctionName('postToSpace')
    //.setParameters({"topLabel" : myItem.topLabel, "titleText" : myItem.titleText, "detailText" : myItem.detailText, "bottomLabel" : myItem.bottomLabel, "startIcon" : myItem.startIcon})
    .setParameters({"itemID" : itemID})
    .setLoadIndicator(CardService.LoadIndicator.SPINNER); 
  
  const postToSpaceButton = CardService.newTextButton()
    .setText('Post To Space')
    .setOnClickAction(postToSpaceAction);   

  const spacesDropdown = generateSpacesDropdown('Space','Select','');
  
  const searchSection = CardService.newCardSection()
      .addWidget(topImage)
      .addWidget(topLabelInput)
      .addWidget(titleTextInput)
      .addWidget(detailTextInput)
      .addWidget(bottomLabelInput)
      .addWidget(startIconInput)
      .addWidget(searchButton)
      .addWidget(postToSpaceButton)
      .addWidget(generateTextButton)
      
  builder.addSection(searchSection);

  //return notify();
  return builder.build();
}

/** Post to Space */

function postToSpace(e){

  var itemID = e.parameters.itemID;
  
  /**
  var myItem = {};
  myItem.topLabel = e.parameters.topLabel;
  myItem.titleText = e.parameters.titleText;
  myItem.bottomLabel = e.parameters.bottomLabel;
  myItem.startIcon = e.parameters.startIcon;
  myItem.detailText = e.parameters.detailText;
  */

  const builder = CardService.newCardBuilder();

  const itemDisplay = new CardService.newDecoratedText()
    .setTopLabel(basketItems[itemID].topLabel)
    .setText(basketItems[itemID].titleText + "\n" + basketItems[itemID].detailText)
    .setWrapText(true)
    .setBottomLabel(basketItems[itemID].bottomLabel)
    .setStartIcon(CardService.newIconImage().setIconUrl(basketItems[itemID].startIcon))
    .setOnClickAction(CardService.newAction()
        .setFunctionName('editItem')
        //.setParameters({"topLabel" : myItem.topLabel, "titleText" : myItem.titleText, "detailText" : myItem.detailText, "bottomLabel" : myItem.bottomLabel, "startIcon" : myItem.startIcon})
        .setParameters({"itemID" : itemID})
        .setLoadIndicator(CardService.LoadIndicator.SPINNER)
        )
    .setEndIcon(CardService.newIconImage()
        .setIcon(CardService.Icon.DESCRIPTION)
        )
    ; 

  const postToSpaceAction = CardService.newAction()
    .setFunctionName('sendMessageToSpace')
    //.setParameters({"topLabel" : myItem.topLabel, "titleText" : myItem.titleText, "detailText" : myItem.detailText, "bottomLabel" : myItem.bottomLabel, "startIcon" : myItem.startIcon})
    .setParameters({"itemID" : itemID})
    .setLoadIndicator(CardService.LoadIndicator.SPINNER); 
  
  const postToSpaceButton = CardService.newTextButton()
    .setText('Send Message')
    .setOnClickAction(postToSpaceAction)
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED);   

  const spacesDropdown = generateSpacesDropdown('space','Select','');

  const messageInput = CardService.newTextInput().setTitle('Message')
    .setFieldName('message')
    .setValue('');
  
  const searchSection = CardService.newCardSection()
      .addWidget(itemDisplay)
      .addWidget(spacesDropdown)
      .addWidget(messageInput)
      .addWidget(postToSpaceButton);

  builder.addSection(searchSection);

  //return notify();
  return builder.build();

}

function sendMessageToSpace(e) {

  var itemID = e.parameters.itemID;
  var message = e.formInputs.message;
  var spaceName = e.formInputs.space;

  /** 
  var myItem = {};
  myItem.topLabel = e.parameters.topLabel;
  myItem.titleText = e.parameters.titleText;
  myItem.detailText = e.parameters.detailText;
  myItem.bottomLabel = e.parameters.bottomLabel;
  myItem.startIcon = e.parameters.startIcon;
  myItem.spaceName = e.formInputs.space;
  myItem.message = e.formInputs.message;
  */


  var formattedMessage = message + "... \n\```" + basketItems[itemID].titleText + "\n\n" + basketItems[itemID].detailText + "\n\n" + basketItems[itemID].topLabel + "\n\n" + basketItems[itemID].bottomLabel + "\n\n\```" + basketItems[itemID].startIcon;

  /** - - - human users can't post card format, need to give the app a service token to post using cards as an app - leaving this code here for now 8/2/2024 LE

  const cardBuilder = CardService.newCardBuilder();
  const cardSection = CardService.newCardSection();

  cardSection.addWidget(CardService.newDecoratedText()
    .setTopLabel(myItem.topLabel)
    .setText(myItem.titleText)
    .setBottomLabel(myItem.bottomLabel)
    .setStartIcon(CardService.newIconImage().setIconUrl(myItem.startIcon))
  );

  cardBuilder.addSection(cardSection);
  */

  var rc = "";
  rc = postMessageWithUserCredentials(spaceName,formattedMessage);
  //rc = postMessageWithAppCredentials(myItem.spaceName);

  return notify("Message posted! " + rc);

}

function updateItem(e) {

  var itemID = e.parameters.itemID;

  basketItems[itemID].topLabel = e.formInputs.topLabel;
  basketItems[itemID].titleText = e.formInputs.titleText;
  basketItems[itemID].detailText = e.formInputs.detailText;
  basketItems[itemID].bottomLabel = e.formInputs.bottomLabel;
  basketItems[itemID].startIcon = e.formInputs.startIcon;  

  return notify("Updated " + basketItems[itemID].titleText + "!");

}

/** go to root */

function gotoRootCard() {
  
  var nav = CardService.newNavigation().popToRoot();
  return CardService.newActionResponseBuilder()
      .setNavigation(nav)
      .build();

}

/** create and add text to email */

function myGeneratedText(e) {
  
  var itemID = e.parameters.itemID;
  var content = "";
  
  if(itemID != null && itemID != undefined) 
  {
    content = "<br/><img src='" + basketItems[itemID].startIcon + "' width='200' height=auto /><br/><br/>" + basketItems[itemID].topLabel + "<br/>" + basketItems[itemID].titleText + "<br/>" + basketItems[itemID].detailText + "<br/>" + basketItems[itemID].bottomLabel + "<br/>";
  } 

  //return JSON.stringify(e);
  //return e.gmail.messageId;  

  switch (e.hostApp) {
    case 'docs':
      const doc = DocumentApp.getActiveDocument();
      const cursor = doc.getCursor();
      if (!cursor) {
        return notify('Unable to insert text, no cursor.');
      }
      //content = generateText({style: 'plaintext', ...myOption});
      cursor.insertText(content);
      return notify('Text inserted');
    case 'slides':
      const slides = SlidesApp.getActivePresentation();
      const textRange = slides.getSelection().getTextRange();
      if (!textRange) {
        return notify('Unable to insert text, no cursor.');
      }
      //content = generateText({style: 'plaintext', ...myOption});
      textRange.insertText(0, content);
      return notify('Text inserted');
    case 'sheets':
      const sheets = SpreadsheetApp.getActiveSpreadsheet();
      const cell = sheets.getCurrentCell();
      if (!cell) {
        return notify('Unable to insert text, no cursor.');
      }
      //content = generateText({style: 'plaintext', ...myOption});
      cell.setValue(content);
      return notify('Text inserted');
    case 'gmail':
      //content = generateText({style: 'html', ...myOption});
     /** 
      const myMessageID = new String(e.gmail.messageId);
      const myCurrentMessage = GmailApp.getMessageById(myMessageID);
      const myDraftReply = myCurrentMessage.createDraftReply(content);

      return notify('Added \"' + content + '\" to message');
      **/
      
      const updateAction = CardService.newUpdateDraftBodyAction()
          .addUpdateContent(content, CardService.ContentType.MUTABLE_HTML)
          .setUpdateType(CardService.UpdateDraftBodyType.IN_PLACE_INSERT);
      return CardService.newUpdateDraftActionResponseBuilder()
          .setUpdateDraftBodyAction(updateAction)
          .build();
      

    default:
      return notify('Host app not supported.' + JSON.stringify(e.hostApp));
  }
}

function generateSpacesDropdown(fieldName, fieldTitle, previousSelected) {
  var selectionInput = CardService.newSelectionInput().setTitle(fieldTitle)
    .setFieldName(fieldName)
    .setType(CardService.SelectionInputType.DROPDOWN);

    const SPACES_MAP = getAllSpaces();
    SPACES_MAP.forEach((language, index, array) => {
    selectionInput.addItem(language.text, language.val, language.val == previousSelected);
  })

  return selectionInput;
}

