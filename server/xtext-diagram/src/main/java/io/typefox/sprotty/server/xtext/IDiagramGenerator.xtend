/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.typefox.sprotty.server.xtext

import io.typefox.sprotty.api.SModelRoot
import java.util.Map
import org.eclipse.emf.ecore.resource.Resource
import org.eclipse.xtext.util.CancelIndicator

interface IDiagramGenerator {
	
	def SModelRoot generate(Resource resource, Map<String, String> options, CancelIndicator cancelIndicator)
	
}