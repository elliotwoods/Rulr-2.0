var currentDebugScope = null;

export function activate() {
	enter = enter_active;
	leave = leave_active;
}

export function deactivate() {
	enter = enter_deactivated;
	leave = leave_deactivated;
}

function getMethodNames(classPrototype) {
	if (classPrototype == null) {
		return [];
	}

	let methodNames = Object.getOwnPropertyNames(classPrototype);
	if ('__proto__' in classPrototype) {
		methodNames.concat(getMethodNames(classPrototype.__proto__));
	}

	//filter duplicates
	methodNames = methodNames.filter(function (item, pos, self) {
		return self.indexOf(item) == pos;
	});

	//remove privates
	methodNames = methodNames.filter((item) => {
		return item.substr(0, 1) != "_";
	});

	return methodNames;
}

export function wrapClassInstanceMethods(classInstance) {
	let methodNames = getMethodNames(classInstance.__proto__);

	for (let methodName of methodNames) {
		let method = classInstance[methodName];

		if (method.constructor.name == "AsyncFunction") {
			classInstance[methodName] = (...args) => {
				enter(classInstance, methodName);
				method(args);
				leave();
			};
		}
		else {
			classInstance[methodName] = async (...args) => {
				enter(classInstance, methodName);
				await method(args);
				leave();
			};
		}
	}
}

const wrapMethod = (fn, methodName) => {
	return function (...args) {
		var debugScope = enter(this, methodName);
		var result = fn.apply(this, args);
		if(debugScope != undefined) {
			debugScope.leave();
		}
		return result;
	}
}

const wrapAsyncMethod = (fn, methodName) => {
	return async function (...args) {
		var debugScope = enter(this, methodName);
		var result = await fn.apply(this, args);
		if(debugScope != undefined) {
			debugScope.leave();
		}
		return result;
	}
}

export function wrapClassPrototypeMethods(classDefinition) {
	let methodNames = Reflect.ownKeys(classDefinition.prototype);
	for (let methodName of methodNames) {
		let method = classDefinition.prototype[methodName];

		let extendedMethodName = `${classDefinition.name}::${methodName}`;
		if (method.constructor.name == "AsyncFunction") {
			classDefinition.prototype[methodName] = wrapAsyncMethod(method, extendedMethodName);
			//Object.defineProperty(classDefinition.prototype, methodName, { value : wrapAsyncMethod(method, methodName)});
		}
		else {
			// Don't wrap non async functions (they're less important)
			//classDefinition.prototype[methodName] = wrapMethod(method, extendedMethodName);
			//Object.defineProperty(classDefinition.prototype, methodName, { value : wrapMethod(method, methodName)});
		}
	}
}


export function enter(instance, methodName) {

}

export function leave() {

}

export class Scope {
	constructor(instance, methodName) {

		this.instance = instance;
		this.methodName = methodName;
		this.children = [];

		this.parentDebugScope = currentDebugScope;
		if (this.parentDebugScope != null) {
			this.parentDebugScope.children.push(this);
		}
		currentDebugScope = this;
	}

	leave() {
		currentDebugScope = this.parentDebugScope;
	}

	report() {
		var description = {
			'name': this.methodName,
			'description': 'test',
			'nodeInstance': this,
			'children': []
		};

		for(let child of this.children) {
			description.children.push(child.report());
		}

		return description;
	}

	getFormatted() {
		var result = `
		<div class="list-group">
		${'getName' in this.instance ? `
			<span class="list-group-item list-group-item-action active">
				${this.instance.getName()}
			</span>
		` : ""}
			<span class="list-group-item list-group-item-action">
				${this.instance.constructor.name}
			</span>
			<span class="list-group-item list-group-item-action">
				${this.methodName}
			</span>	
		${this.children.length > 0 ? `
			<span class="list-group-item list-group-item-action disabled">
				${this.children.length} children
			</span>	
		` : ""}
		</div>
		`;

		return result;
	}
}

function enter_active(instance, methodName) {
	if (methodName == null) {
		var stack = Error().stack;
		var frames = stack.split(/\r\n|\n/);
		var frame = frames[2];
		var methodName = frame.substr(0, frame.indexOf(' ('));
		methodName = methodName.substring(methodName.indexOf("at ") + 3);
	}

	var debugScope = new Scope(instance, methodName);
	return debugScope;
}

function leave_active() {
	currentDebugScope.leave();
}

function enter_deactivated(instance, methodName) {

}

function leave_deactivated() {

}