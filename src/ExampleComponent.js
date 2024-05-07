// ExampleComponent.js
import React, { useState } from "react";
import DialogBox from "./DialogBox";

function ExampleComponent() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleRetryClick = () => {
    // Add your retry logic here
    console.log("Retry button clicked");
    closeDialog(); // Close the dialog if needed
  };

  const handleCustomButtonClick = () => {
    // Add your custom button logic here
    console.log("Custom button clicked");
    closeDialog(); // Close the dialog if needed
  };

  const dialogTitle = "Error Message";
  const dialogContent = "Incorrect username or password!";
  const dialogButtons = [
    { label: "Retry", onClick: handleRetryClick },
    { label: "Custom", onClick: handleCustomButtonClick },
  ];

  return (
    <div>
      <button onClick={openDialog}>Open Dialog</button>

      {isDialogOpen && (
        <DialogBox
          title={dialogTitle}
          content={dialogContent}
          buttons={dialogButtons}
        />
      )}
    </div>
  );
}

export default ExampleComponent;
