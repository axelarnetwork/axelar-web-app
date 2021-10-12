require('dotenv').config();
import {init, start} from "./ApplicationConfig/server";

init().then(() => start());