global.fs = require('fs');
global.path = require('path');
let request = require('supertest');
global.chai = require('chai');

global.typeformDataAPI = request('https://api.typeform.com/v1');

