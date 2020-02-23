import React, { useReducer } from "react";
import { remote } from "electron";
import styled from "styled-components";
import isDev from "electron-is-dev";
import ConfigurationContext from "./configuration/configuration.context";
import EnvironmentContext from "./configuration/environment.context";
import NavigationProvider from "./navigation/navigation.provider";
import StageSelector from "./stage/stageSelector.presenter";
import LeftSide from "./side/leftSide.presenter";
import RightSide from "./side/rightSide.presenter";
import Fight from "./fight/fight.presenter";
import ErrorBoundary from "./error/errorBoundary.view";
import FatalError from "./error/fatalError.view";
import Requirement from "./error/requirement.view";
import versusImagePath from "./assets/versus.png";
const app = remote.app;
const fs = remote.require("fs");
const path = remote.require("path");
const execFile = remote.require("child_process").execFile;

let currentDirectory;
if (remote.process.argv.length >= 3) {
  currentDirectory = path.normalize(remote.process.argv[2]);
} else if (isDev) {
  currentDirectory = path.resolve(app.getAppPath(), "dev-env");
} else {
  if (remote.process.env.PORTABLE_EXECUTABLE_DIR) {
    currentDirectory = remote.process.env.PORTABLE_EXECUTABLE_DIR;
  } else if (remote.process.env.INIT_CWD) {
    currentDirectory = remote.process.env.INIT_CWD;
  } else if (app.getPath("exe")) {
    currentDirectory = path.dirname(app.getPath("exe"));
  } else if (remote.process.execPath) {
    currentDirectory = remote.process.execPath;
  }
}
if (path.basename(currentDirectory) === "MacOS") {
  currentDirectory = path.resolve(currentDirectory, "..", "..", "..");
}

const Wrapper = styled.main`
  flex: 1;
  height: 100%;
  background: #333;
  color: white;
  font-family: BadaBoom;
  overflow: hidden;
  background: url(./assets/background.jpg);
  background-size: cover;
  background-position: 50%;
`;
const CustomBackground = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;
const Versus = styled.img`
  position: absolute;
  z-index: 100;
  left: 50vw;
  bottom: 0;
  height: 30vh;
  transform: translateX(-50%);
`;

export default function App() {
  if (!currentDirectory) {
    return (
      <Requirement>
        <p>No current directory</p>
      </Requirement>
    );
  }

  const configurationFilePath = path.resolve(currentDirectory, "quick-versus.json");
  if (!fs.existsSync(configurationFilePath)) {
    return (
      <Requirement>
        <p>Configuration file is missing: {configurationFilePath}</p>
      </Requirement>
    );
  }

  const mugenPath = path.resolve(currentDirectory, "mugen.exe");
  if (!fs.existsSync(mugenPath)) {
    return (
      <Requirement>
        <p>Mugen executable file is missing: {mugenPath}</p>
      </Requirement>
    );
  }

  const configurationContent = fs.readFileSync(configurationFilePath);
  let configuration;
  try {
    configuration = JSON.parse(configurationContent);
  } catch(error) {
    return (
      <FatalError>
        <p>Invalid configuration file:</p>
        <p>{configurationFilePath}</p>
        <p>{error.message}</p>
      </FatalError>
    );
  }

  const environment = {
    app,
    currentDirectory,
    mugenPath,
    configurationFilePath,
    isDev
  };

  let customBackground;
  if (configuration.background) {
    const imagePath = path.resolve(environment.currentDirectory, configuration.background);
    if (fs.existsSync(imagePath)) {
      customBackground = <CustomBackground src={imagePath}/>
    }
  }

  return (
    <ErrorBoundary>
      <EnvironmentContext.Provider value={environment}>
        <ConfigurationContext.Provider value={configuration}>
          <NavigationProvider>
            <Wrapper>
              {customBackground}
              <LeftSide />
              <RightSide />
              <Versus src={versusImagePath} />
              <StageSelector />
              <Fight />
            </Wrapper>
          </NavigationProvider>
        </ConfigurationContext.Provider>
      </EnvironmentContext.Provider>
    </ErrorBoundary>
  );
}
