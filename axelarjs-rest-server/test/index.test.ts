import { Server } from "@hapi/hapi";
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";

import { init } from "../src/ApplicationConfig/server";

describe("smoke test", async () => {

	let server: Server;

	beforeEach((done) => {
		init().then(s => { server = s; done(); });
	});

	afterEach((done) => {
		server.stop().then(() => done());
	});

	it("index responds", async () => {

		const res = await server.inject({
			method: "get",
			url: "/"
		});

		expect(res.statusCode).to.equal(200);
		expect(res.result).to.equal("This is working!");

	});
})