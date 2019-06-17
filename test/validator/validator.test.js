'use strict';

const {expect} = require('chai');
const validator = require('../../src/validator');
const data = require('../fixtures/correct.data.json');

const missingMarkerId = require('../fixtures/error.marker.json');
const missingNoteText = require('../fixtures/error.note.json');
const missingSummary = require('../fixtures/error.summary.json');


describe('Validator Test', () => {

  it('Validate to be failed if data is undefined', done => {
    const {status, errors} = validator(undefined);
    expect(status).to.be.a('boolean').that.to.eq(false);
    expect(errors).to.be.not.null;
    expect(errors).to.be.an('array');
    done();
  });

  it('Validate to be failed if data is null', done => {
    const {status, errors} = validator(null);
    expect(status).to.be.a('boolean').that.to.eq(false);
    expect(errors).to.be.not.null;
    expect(errors).to.be.an('array');
    done();
  });

  it('Validate to be failed if data is [1,2,3]', done => {
    const {status, errors} = validator([1,2,3]);
    expect(status).to.be.a('boolean').that.to.eq(false);
    expect(errors).to.be.not.null;
    expect(errors).to.be.an('array');
    done();
  });

  it('Validate to be successful', done => {
    const {status, errors} = validator(data);
    expect(status).to.be.a('boolean').that.to.eq(true);
    expect(errors).to.be.null;
    done();
  });


  it('Validate to be failed if markerId is an invalid object', done => {
    const {status, errors} = validator(missingMarkerId);
    expect(status).to.be.a('boolean').that.to.eq(false);
    expect(errors).to.be.not.null;
    done();
  });


  it('Validate to be failed if does not find text message in Note', done => {
    const {status, errors} = validator(missingNoteText);
    expect(status).to.be.a('boolean').that.to.eq(false);
    expect(errors).to.be.not.null;
    done();
  });

  it('Validate to be failed if summary is an invalid object', done => {
    const {status, errors} = validator(missingSummary);
    expect(status).to.be.a('boolean').that.to.eq(false);
    expect(errors).to.be.not.null;
    done();
  });
});