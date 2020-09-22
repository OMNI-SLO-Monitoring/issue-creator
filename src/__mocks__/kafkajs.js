'use strict';

const kafkajs = jest.genMockFromModule('kafkajs');

class Consumer {
  constructor({ groupId }) {
    this.groupId = groupId;
  }

  getGroupId() {
    return this.groupId;
  }

  async connect() {
    return Promise.resolve();
  }

  async subscribe({ topic }) {

  }

  async disconnect() {
    return Promise.resolve();
  }
}

kafkajs.Kafka = class Kafka {
  constructor(config) {
    this.brokers = config.brokers;
    this.clientId = config.clientId;
    this.topics = {};
  }

  consumer({ groupId }) {
    return new Consumer({
      groupId
    });
  }
};

module.exports = kafkajs;