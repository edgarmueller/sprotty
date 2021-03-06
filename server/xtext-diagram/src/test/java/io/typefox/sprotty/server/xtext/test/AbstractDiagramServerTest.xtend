/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.typefox.sprotty.server.xtext.test

import com.google.inject.Inject
import io.typefox.sprotty.api.Action
import io.typefox.sprotty.api.ActionMessage
import io.typefox.sprotty.server.xtext.testlanguage.diagram.TestLanguageDiagramGenerator
import org.eclipse.xtext.ide.server.UriExtensions
import org.eclipse.xtext.testing.AbstractLanguageServerTest

abstract class AbstractDiagramServerTest extends AbstractLanguageServerTest {
	
	protected static val CLIENT_ID = 'testClient'
	
	@Inject extension UriExtensions
	
	new() {
		super('testlang')
	}
	
	protected def getServiceProvider(String uri) {
		resourceServerProviderRegistry.getResourceServiceProvider(uri.toUri)
	}
	
	protected def action(Action action) {
		languageServer.notify('diagram/accept', new ActionMessage(CLIENT_ID, action))
	}
	
	protected def closeDiagram() {
		languageServer.notify('diagram/didClose', CLIENT_ID)
	}
	
	protected def assertGenerated(CharSequence expectedResult) {
		val diagramGenerator = getServiceProvider('file:/dummy.testlang').get(TestLanguageDiagramGenerator)
		assertEquals(expectedResult.toString.trim, diagramGenerator.results.toString)
	}
	
}