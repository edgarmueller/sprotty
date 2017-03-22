package io.typefox.sprotte.server.examples

import io.typefox.sprotte.api.DiagramServer
import io.typefox.sprotte.api.RequestModelAction
import io.typefox.sprotte.api.ResizeAction
import io.typefox.sprotte.api.SEdge
import io.typefox.sprotte.api.SModelRoot
import io.typefox.sprotte.api.SNode
import io.typefox.sprotte.api.SelectAction
import io.typefox.sprotte.api.SetModelAction
import java.util.concurrent.CompletableFuture
import org.eclipse.jetty.util.log.Slf4jLog

class SimpleDiagramServer implements DiagramServer {

	static val LOG = new Slf4jLog(SimpleServerLauncher.name)

	override requestModel(RequestModelAction action) {
		val model = new SetModelAction => [
			newRoot = new SModelRoot => [
				type = 'graph'
				id = 'graph'
				children = #[
					new SNode => [
						type = 'node:circle'
						id = 'node0'
						x = 100.0
						y = 100.0
					],
					new SNode => [
						type = 'node:circle'
						id = 'node1'
						x = 300.0
						y = 150.0
					],
					new SEdge => [
						type = 'edge:straight'
						id = 'edge0'
						sourceId = 'node0'
						targetId = 'node1'
					]
				]
			]
		]
		CompletableFuture.completedFuture(model)
	}
	
	override resize(ResizeAction action) {
		throw new UnsupportedOperationException
	}

	override elementSelected(SelectAction action) {
		LOG.info('element selected: ' + action)
	}

}