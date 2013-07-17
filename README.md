<?xml version="1.0" encoding="UTF-8"?>
<roboto>
	<interface url='www.google.com' id='root' child='baidu' cookie='cookie'>
		<type> media | xml | json</type>
		<target>
			<name>
				<convert>
					<tuple>
						<from>^hello</from>
						<to>hello, world</to>
					</tuple>
					<tuple>
						<from>.html$</from>
						<to>.jpg</to>
					</tuple>
				</convert>
				<as>baidu picture</as>
				<route>
					<!-- comment here -->
					<div id='body' class='context' index='1'>
						<div>
							<ul id='1'>
								<li>
									<span>
										<a index='3'>href</a>
									</span>
								</li>
							</ul>
						</div>
					</div>
				</route>
			</name>
			<url></url>
			<category></category>
			<resolution></resolution>
		</target>
		<headers>
			<cookie>
				<tuple>
				    <key>PHP</key>
				    <value>123455666666666666666666</value>
				</tuple>
				<tuple>
				    <key>PHP2</key>
				    <value>888888888888888888888888</value>
				</tuple>
			</cookie>
		</headers>
	</interface>
	<interface id='child' parent='root' child='grandchild' cookie='cookie'>
	</interface>
	<interface id='grandchild' parent='root' cookie='true'>
	</interface>
</roboto> 