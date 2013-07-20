<?xml version="1.0" encoding="UTF-8"?>
<roboto>
    <config>
		<url>www.baidu.com</url>
		<type> media | xml | json</type>
		<path>./data/</path>
        <ratio action='large'>
            <width>4000</width>
            <height>1384</height>
        </ratio>
    </config>
	<web id='root' child='baidu' cookie='cookie'>
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
					<div id='body' class='context' index='1'>
						<div>
							<ul id='list'>
								<li>
									<span>
										<a index='3'>[href]</a>
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
	</web>
	<web id='baidu' parent='root' child='grandchild' cookie='cookie'>
	</web>
	<web id='grandchild' parent='root' cookie='true'>
	</web>
</roboto>
