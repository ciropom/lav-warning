# -*- mode: python; coding: utf-8 -*-
# :Progetto:  LAV warning --
# :Creato:    mer 09 feb 2011 17:33:16 CET
# :Autore:    Danilo Tomasoni <danilo.tomasoni@cryptolab.net>
# :Licenza:   GNU General Public License version 3 or later
#

import os
from paver.easy import *
TITANIUM_SDK_PART = 'linux/1.7.2'

env = environment
env.android_sdk = path(os.environ['ANDROID_SDK'])
env.titanium_sdk = path(os.environ['TITANIUM_SDK']) / TITANIUM_SDK_PART
env.base = path("/home/ciropom/titanium-lav/LAV_warning")
env.bin = env.base/'bin'
env.and_tools = env.android_sdk/'tools'

@task
@consume_args
def android(args):
    "Launch the android SDK manager"
    _android(args, env.and_tools)

def _android(args, and_tools, capture=False):
    return sh(and_tools/'android' + ' ' + ' '.join(args), capture)

@task
def build_docs(base, bin):
    "Build the README.rst to html"
    sh(' '.join((bin/'rst2', 'html', base/'README.rst', base/'README.html')))
    print 'Visit file://%s with your browser' % (base/'README.html')

@task
@cmdopts([
        ('module', 'm', 'Create a module project.'),
        ('application', 'a', 'Create an application project. (DEFAULT)'),
        ('name=', 'n', 'Set the name of the project.'),
        ('id=', 'i', 'Set the id of the project, something like "airpim.mobile.<choose>".'),
        ('dir=', 'd', 'Set the path where the project should be created.')
        ])
def create_project(options, titanium_sdk, android_sdk):
    """
    Create a new Titanium mobile project. Use 'paver --help create_project'
    to see the available options.
    Usually, it should be invoked with something like:

      paver create_project -a -n AppName -i com.airpim.namespace, -d path/to/destination
    """
    import sys
    bin = titanium_sdk/'titanium.py'
    args =  ' --platform=android --type=%(type)s --name=%(name)s --id=%(id)s --dir=%(dir)s'
    args += ' --android=%s' % android_sdk
    options.create_project.type = 'module' if options.create_project.get('module', False) else 'project'
    cmdline = bin + ' create' + args % options.create_project
    sh(sys.executable + ' ' + cmdline)

@task
@cmdopts([
        ('dir=', 'd', 'The directory where thr project resides. (REQUIRED)'),
        ('keystore=', 'k', 'The path to the keystore'),
        ('storepass=', 'p', 'The password for the keystore'),
        ('alias=', 'a', 'The certificate alias name'),
        ('dist=', 'o', 'Directory where to write the final apk'),
        ])
def build(options, titanium_sdk, android_sdk, base):
    "Build a Titanium application"
    print titanium_sdk
    builder = _titaniumBuilderForApp(options.build.dir, titanium_sdk,
                                     android_sdk, base)
    keystore = options.build.get('keystore', None)
    if keystore: keystore = path(keystore).abspath()
    storepass = options.build.get('storepass', 'tirocks')
    alias = options.build.get('alias', 'tidev')
    dist = options.build.get('dist', None)
    if dist: dist = path(dist).abspath()
    builder.build_and_run(True, 1, build_only=True,
                          keystore=keystore, keystore_pass=storepass,
                          keystore_alias=alias, dist_dir=dist)


@task
@cmdopts([
        ('dir=', 'd', 'The directory where thr project resides. (REQUIRED)'),
        ('size=', 's', 'The size of the display may be "normal" (DEFAULT, HVGA like HTC '
         'Hero or LG Optimus One) or "big" (WVGA800 like Galaxy S or Nexus S) or "small".'),
        ('name=', 'n', 'Optional name of a custom AVD'),
        ('fast', 'f', 'Do a fast run by only copying resources (USE WITH CARE)')
        ])
def run(options, titanium_sdk, android_sdk, base):
    "(build and) Run a Titanium application"
    builder = _titaniumBuilderForApp(options.run.dir, titanium_sdk, android_sdk, base)
    name, skin = _calcAVDIdAndSkin(options.run.get('size'), options.run.get('name'))
    builder.command = 'run'
    if options.run.get('fast', False):
        _copyResources(builder)
        builder.kill_app()
        builder.run_app()
    else:
        builder.build_and_run(False, name)

@task
@cmdopts([
        ('dir=', 'd', 'The directory where thr project resides. (REQUIRED)'),
        ('size=', 's', 'The size of the display may be "normal" (DEFAULT, HVGA like HTC '
         'Hero or LG Optimus One) or "big" (WVGA800 like Galaxy S or Nexus S) or "small".'),
        ('name=', 'n', 'Optional name of a custom AVD')
        ])
def emulator(options, titanium_sdk, android_sdk, base):
    """
    Runs the Android emulator.
    """
    builder = _titaniumBuilderForApp(options.emulator.dir,
                                     titanium_sdk, android_sdk, base)
    name, skin = _calcAVDIdAndSkin(options.emulator.get('size'), options.emulator.get('name'))
    builder.command = 'build'
    builder.run_emulator(name, skin)

@task
def install_demos(base):
    """
    Install Titanium demos
    """
    demos = base/'demos'
    if not demos.exists():
        os.makedirs(demos)
        with pushd(demos):
            sh('git clone http://github.com/appcelerator/KitchenSink.git')
            sh('git clone http://github.com/appcelerator/tweetanium.git')


@task
@consume_args
def adb(args, android_sdk):
    "Launch the Android Debug Bridge"
    sh(android_sdk/'platform-tools'/'adb' + ' ' + ' '.join(args))

SIMPLE_PAVER_COMPLETION_HELPER = """\

# bash completion

_paver_commands()
{
     paver --help | grep '^  [[:alpha:]]' | cut -d' ' -f3
}

_paver()
{
    cur=${COMP_WORDS[COMP_CWORD]}
    COMPREPLY=( $( compgen -W "$(_paver_commands)" $cur ) )
}

complete -F _paver -o default paver
"""

@task
def install_bash_completion_for_paver():
    "Install bash completion support for paver"

    script = path('bin/activate')
    if '# bash completion' not in script.lines(retain=False):
        dry("Injecting bash completion support for paver in %s" % script,
            script.write_text, SIMPLE_PAVER_COMPLETION_HELPER, append=True)
    else:
        info("Bash completion support already injected in %s", script)

@task
@cmdopts([
        ('dir=', 'd', 'The directory where thr project resides. (REQUIRED)'),
        ('start', None, 'Start the fastev server (DEFAULT)'),
        ('stop', None, 'Stop the fastev server'),
        ])
def fastdev(options, titanium_sdk, android_sdk, base):
    fastdev = titanium_sdk / 'android' /'fastdev.py'
    cwd = path(options.fastdev.dir)
    if options.fastdev.get('stop'):
        cmd = 'stop'
    else:
        cmd = 'start'
    sh('python ' + fastdev + ' ' + cmd, cwd=cwd)

@task
def eclipse():
    sh('eclipse')

def _copyResources(builder):
    resources_dir = os.path.join(builder.top_dir,'Resources')
    builder.assets_dir = os.path.join(builder.project_dir,'bin','assets')
    builder.assets_resources_dir = os.path.join(builder.assets_dir,'Resources')
    builder.device_args = ['-e']
    builder.sdcard_copy = True
    builder.app_installed = True
    builder.deploy_type = 'test'
    builder.sdcard_resources = '/sdcard/Ti.debug/%s/Resources' % builder.app_id
    builder.copy_project_resources()


@task
@cmdopts([
        ('dir=', 'd', 'The directory where thr project resides. (REQUIRED)'),
        ('size=', 's', 'The size of the display may be "normal" (DEFAULT, HVGA like HTC '
         'Hero or LG Optimus One) or "big" (WVGA800 like Galaxy S or Nexus S).'),
        ('name=', 'n', 'Optional name of a custom AVD'),
        ('fast', 'f', 'Do a fast run by only copying resources (USE WITH CARE)')
        ])
def run_tests(options, titanium_sdk, android_sdk, base):
    "(build and) Run a Titanium application's tests"
    builder = _titaniumBuilderForApp(options.run_tests.dir, titanium_sdk, android_sdk, base)
    name, skin = _calcAVDIdAndSkin(options.run_tests.get('size'), options.run_tests.get('name'))
    builder.command = 'run'
    builder._airpim_run_tests = True
    if options.run_tests.get('fast', False):
        _copyResources(builder)
        builder.kill_app()
        builder.run_app()
    else:
        builder.build_and_run(False, name) #, debugger_host='localhost:6000')

def _calcAVDIdAndSkin(size=None, name=None):
    size = size or 'normal'
    if size == 'big':
        skin = 'WVGA800'
    elif size == 'normal':
        skin = 'HVGA'
    elif size == 'small':
        skin = 'QVGA'
    else:
        if name:
            skin = ''
        else:
            raise ValueError('Invalid value for size parameter, %s' % size)

    avd_id = name or ('lav_' + size)
    return avd_id, skin

def _titaniumBuilderForApp(app_path, titanium_sdk, android_sdk, base):
    import sys
    builder_dir = titanium_sdk/'android'
    sys.path.insert(0, builder_dir)
    sys.path.append(titanium_sdk)
    sys.path.append(titanium_sdk/'common')
    sys.path.append(titanium_sdk/'module')
    import builder
    # fix missing global variables not available when importing
    # builder
    builder.sdk_dir = android_sdk
    builder.template_dir = template_dir = builder_dir
    app_path = path(os.path.abspath(app_path))
    builder.log = builder.TiLogger(app_path/'build.log')

    class APBuilder(builder.Builder):
        """
        A patched up version of Titanium's Android project builder. It
        simplyfies the environment need to use it, fixes some paths
        and fixes the Andoid Virtual Device creation.
        """
        def __init__(self, project_dir):
            tiappxml = builder.TiAppXML(app_path/'tiapp.xml')
            app_id = tiappxml.properties['id']
            project_name = tiappxml.properties['name']
            super(APBuilder, self).__init__(project_name, android_sdk, project_dir,
                                            builder_dir, app_id)
            self.home_dir = base/'.titanium'
            self.android_home_dir = base/'.android'
            if not self.home_dir.exists():
                os.makedirs(self.home_dir)
            self.sdcard = self.home_dir/'android2.sdcard'

        def create_avd(self, name, skin_name, target_id=None):
            """
            Relax the constraints on the avd name.
            By default use a target_id (the api-level of the libs that
            will be available into the avd) not numeric because
            numeric ids are dependent on the installation and that
            includes the Google APIs so that Appcelerator's example
            applications run out of the box.
            """
            if not target_id:
                target_label = r'"Google Inc.:Google APIs:7"'
                cmd_out = _android(['list', 'targets'], env.and_tools, True)
                for line in cmd_out.split('\n'):
                    if line.startswith('id:'):
                        id, label =  line[3:].split('or')
                        if label.strip() == target_label:
                            target_id = id.strip()
                            break

            if not os.path.exists(self.home_dir):
                os.makedirs(self.home_dir)
            if not os.path.exists(self.sdcard):
                builder.info("Creating shared 64M SD card for use in Android emulator(s)")
                builder.run.run([self.sdk.get_mksdcard(), '64M', self.sdcard])

            avd_path = os.path.join(self.android_home_dir, 'avd')
            my_avd = os.path.join(avd_path,"%s.avd" % name)
            if not os.path.exists(my_avd):
                builder.info("Creating new Android Virtual Device (%s %s)" % (name, skin_name))
                inputgen = os.path.join(template_dir,'input.py')
                builder.pipe([sys.executable, inputgen],
                             [self.sdk.get_android(), '--verbose', 'create', 'avd', '--name',
                              name, '--target', target_id, '-s', skin_name, '--force',
                              '--sdcard', self.sdcard])
                inifile = os.path.join(my_avd,'config.ini')
                inifilec = open(inifile,'r').read()
                inifiledata = open(inifile,'w')
                inifiledata.write(inifilec)
                # TODO - Document options
                for hw_option in builder.android_avd_hw.keys():
                    inifiledata.write("%s=%s\n" % (hw_option, builder.android_avd_hw[hw_option]))
                    inifiledata.close()

            return name

        def run_app(self):
            if getattr(self, '_airpim_run_tests', False):
                action = 'com.airpim.TESTS'
                builder.info("Launching application ... %s tests" % self.name)
                output = self.run_adb('shell', 'am', 'start',
                                      '-a', action,
                                      '-n', '%s/.%sActivity' % (self.app_id , '_tests_runner'))
            else:
                action = 'android.intent.action.MAIN'
                builder.info("Launching application ... %s" % self.name)
                output = self.run_adb('shell', 'am', 'start',
                                      '-a', 'android.intent.action.MAIN',
                                      '-c','android.intent.category.LAUNCHER',
                                      '-n', '%s/.%sActivity' % (self.app_id , self.classname))
            builder.trace("Launch output: %s" % output)

        def kill_app(self):
            killed = False
            processes = self.run_adb('shell', 'ps')
            for line in processes.splitlines():
                    columns = line.split()
                    if len(columns) > 1:
                            pid = columns[1]
                            id = columns[len(columns)-1]

                            if id == self.app_id:
                                self.run_adb('shell', 'kill', pid)
                                killed = True
            if killed:
                builder.info("Killed %s ..." % self.name)


    apbuilder = APBuilder(app_path)
    apbuilder.command = 'build'
    # fix missing global variables not available when importing
    # builder
    builder.s = apbuilder

    # fix js compiler options
    builder.Compiler = patchCompiler(builder)
    return apbuilder

def patchCompiler(builder_mod):
    import sys
    from compiler import run

    class APCompiler(builder_mod.Compiler):

        def compile_javascript(self, fullpath):
            "monkey patch just to force maximum optimization possible"

            js_jar = os.path.join(self.template_dir, 'js.jar')
            # poor man's os.path.relpath (we don't have python 2.6 in windows)
            resource_relative_path = fullpath[len(self.project_dir)+1:].replace("\\", "/")
            # chop off '.js'
            js_class_name = resource_relative_path[:-3]
            escape_chars = ['\\', '/', ' ', '.','-']
            for escape_char in escape_chars:
                    js_class_name = js_class_name.replace(escape_char, '_')

            # TODO: add closure compiling too?
            jsc_args = [self.java, '-classpath', js_jar, 'org.mozilla.javascript.tools.jsc.Main',
                    '-main-method-class', 'org.appcelerator.titanium.TiScriptRunner',
                    '-nosource', '-package', self.appid + '.js', '-encoding', 'utf8',
                    '-o', js_class_name, '-d', self.classes_dir, '-O', '9', fullpath]

            print "[INFO] Compiling javascript: %s" % resource_relative_path
            sys.stdout.flush()
            so, se = run.run(jsc_args, ignore_error=True, return_error=True)
            if not se is None and len(se):
                    sys.stderr.write("[ERROR] %s\n" % se)
                    sys.stderr.flush()
                    sys.exit(1)

    return APCompiler
