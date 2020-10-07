const express = require('express');

module.exports = () => express.Router({ mergeParams: true });
